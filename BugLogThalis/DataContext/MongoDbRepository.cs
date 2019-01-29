using BugLogThalis.Models;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace BugLogThalis.DataContext
{
    public class MongoDbRepository<T> where T : Entity
    {
        protected internal IMongoCollection<T> collection;

        public IMongoCollection<T> Collection { get { return collection; } }

        public MongoDbRepository(IMongoDatabase database, string collectionName)
        {
            this.collection = database.GetCollection<T>(collectionName);
        }

        public virtual async Task<T> GetById(string id)
        {
            var filter = Builders<T>.Filter.Eq("Id", id);
            var query = await collection.FindAsync(filter);
            var result = await query.ToListAsync();
            return result.FirstOrDefault();
        }

        public async Task<IEnumerable<T>> GetAll()
        {
            var documents = await collection.FindAsync(x => true);
            var result = await documents.ToListAsync();

            return result;
        }

        public IQueryable<T> GetQueryAll()
        {
            var documents = collection.AsQueryable();

            return documents;
        }

        public IQueryable<T> GetQuery(Expression<Func<T, bool>> predicate)
        {

            var documents = collection.AsQueryable().Where(predicate);

            return documents;
        }

        public virtual async Task<T> Insert(T entity)
        {
            await collection.InsertOneAsync(entity);
            return entity;
        }

        public virtual async Task<T> Update(T entity)
        {
            var _id = entity.Id;
            var filter = Builders<T>.Filter.Eq("Id", entity.Id);
            var result = await collection.ReplaceOneAsync(filter, entity);

            return entity;
        }

        public virtual async Task<bool> Delete(string id)
        {
            var filter = Builders<T>.Filter.Eq("Id", id);
            var result = await collection.DeleteOneAsync(filter);

            return result.IsAcknowledged && result.DeletedCount == 1;
        }

    }
}
