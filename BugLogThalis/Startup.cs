using System.IO;
using System.Text;
using BugLogThalis.Authorization;
using BugLogThalis.DataContext;
using BugLogThalis.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;

namespace BugLogThalis
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
            var secretKey = Configuration["Tokens:Key"];
            Context = new Context(Configuration["ConncetionString"]);
            FileManager = FileManager.Create(Context.Database);
            _signingKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
        }

        private readonly SymmetricSecurityKey _signingKey;
        private Context Context { get; }
        private FileManager FileManager { get; }
        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddSingleton<Context>(p => Context);
            services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_1);
            services.AddScoped<IUserService, UserService>();
            services.AddScoped<IApplicationService, ApplicationService>();
            services.AddScoped<IReportService, ReportService>();
            services.AddTransient<IAuthenticationProvider, AuthenticationProvider>();
            services.AddSingleton<FileManager>(p => FileManager);
            services.AddCors();

            services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
           .AddJwtBearer(cfg =>
           {
               cfg.RequireHttpsMetadata = false;
               cfg.SaveToken = true;

               cfg.TokenValidationParameters = new TokenValidationParameters()
               {
                   ValidIssuer = Configuration["Tokens:Issuer"],
                   ValidAudience = Configuration["Tokens:Issuer"],
                   IssuerSigningKey = _signingKey
               };
           });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            app.UseCors(builder => builder.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod());
            app.UseAuthentication();
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            if (env.IsProduction())
            {
                app.Use(async (ctx, next) =>
                {
                    ctx.Response.Headers.Add("Content-Security-Policy",
                                            "default-src 'self' * 'unsafe-inline' 'unsafe-eval' data:");
                    await next();
                });
            }
            app.UseMvc();
            app.UseDefaultFiles();
            app.Use(async (context, next) =>
            {
                await next();

                if (context.Response.StatusCode == 404
                    && !Path.HasExtension(context.Request.Path.Value))
                {
                    context.Request.Path = "/index.html";
                    await next();
                }
            });
            
            app.UseStaticFiles();
        }
    }
}
