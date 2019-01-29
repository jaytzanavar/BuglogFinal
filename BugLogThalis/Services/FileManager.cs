using MongoDB.Bson;
using MongoDB.Driver;
using MongoDB.Driver.GridFS;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Security.Cryptography;
using System.Threading.Tasks;

namespace BugLogThalis.Services
{
    public sealed class FileManager
    {
        private static GridFSBucket gridFs;
        private static Lazy<FileManager> lazy = new Lazy<FileManager>();

        public static FileManager Instance { get { return lazy.Value; } }

        public static FileManager Create(IMongoDatabase database)
        {
            lazy = null;
            lazy = new Lazy<FileManager>(() => new FileManager(database));
            return lazy.Value;
        }

        private FileManager(IMongoDatabase database)
        {
            gridFs = new GridFSBucket(database);
        }

        public async Task<Tuple<string, byte[]>> GetFile(string guid)
        {
            var id = ObjectId.Parse(guid);
            var query = await gridFs.FindAsync(Builders<GridFSFileInfo>.Filter.Eq("_id", id));
            var file = await query.SingleOrDefaultAsync();
            if (file == null)
            {
                throw new Exception(string.Format("File not found (id: {0})", guid));
            }
            var array = await gridFs.DownloadAsBytesAsync(id);
            return Tuple.Create(file.Filename, array);
        }

        public async Task<IEnumerable<Tuple<string, byte[]>>> GetFiles(IEnumerable<string> guids)
        {
            var ids = guids.Select(x => ObjectId.Parse(x));
            var query = await gridFs.FindAsync(Builders<GridFSFileInfo>.Filter.In("_id", ids));
            var files = await query.ToListAsync();

            var result = new List<Tuple<string, byte[]>>();
            foreach (var file in files)
            {
                var array = await gridFs.DownloadAsBytesAsync(file.Id);
                result.Add(new Tuple<string, byte[]>(file.Filename, array));
            }
            return result;
        }

        public async Task<GridFSFileInfo> GetFileInfo(string guid)
        {
            var id = ObjectId.Parse(guid);
            var query = await gridFs.FindAsync(Builders<GridFSFileInfo>.Filter.Eq("_id", id));
            var file = await query.SingleOrDefaultAsync();
            if (file == null)
            {
                throw new Exception(string.Format("File not found (id: {0})", guid));
            }

            return file;
        }

        public async Task<string> UploadFile(string fileName, byte[] buffer)
        {
            try
            {
                string hash = GetMD5Hash(buffer);

                var file = await GetFileByMD5(hash);

                if (file != null) //file already exists in the database, so no need to upload it again, just return its Id
                {
                    return file.Id.ToString();
                }
                else //this is a new file, upload it in the database
                {
                    var id = await gridFs.UploadFromBytesAsync(fileName, buffer);
                    return id.ToString();
                }
            }
            catch (Exception exception)
            {
                throw exception;
            }
        }

        public async Task<string> UploadFile(string fileName, Stream stream)
        {
            try
            {
                string hash = GetMD5Hash(stream);

                var file = await GetFileByMD5(hash);

                if (file != null) //file already exists in the database, so no need to upload it again, just return its Id
                {
                    return file.Id.ToString();
                }
                else //this is a new file, upload it in the database
                {
                    var id = await gridFs.UploadFromStreamAsync(fileName, stream);
                    return id.ToString();
                }
            }
            catch (Exception exception)
            {
                throw exception;
            }
        }

        public async Task DeleteFile(string fileId)
        {
            try
            {
                await gridFs.DeleteAsync(ObjectId.Parse(fileId));
            }
            catch (Exception exception)
            {
                if (exception is GridFSFileNotFoundException)
                    return;
                else
                    throw exception;
            }
        }

        private async Task<GridFSFileInfo> GetFileByMD5(string md5)
        {
            var query = await gridFs.FindAsync(Builders<GridFSFileInfo>.Filter.Eq("md5", md5));
            var files = await query.ToListAsync();
            return files.FirstOrDefault();
        }

        private async Task<bool> MD5Exists(string md5)
        {
            var file = await GetFileByMD5(md5);
            return file != null;
        }

        private string GetMD5Hash(Stream stream)
        {
            stream.Position = 0;
            MD5 md5 = MD5.Create();
            var hashArray = md5.ComputeHash(stream);
            stream.Position = 0;
            return ToStandardMD5(hashArray);
        }

        private string GetMD5Hash(byte[] buffer)
        {
            MD5 md5 = MD5.Create();
            var hashArray = md5.ComputeHash(buffer);
            return ToStandardMD5(hashArray);
        }

        private string ToStandardMD5(string hash)
        {
            return hash.Replace("-", "").ToLower();
        }

        private string ToStandardMD5(byte[] hash)
        {
            return ToStandardMD5(BitConverter.ToString(hash));
        }
    }
}
