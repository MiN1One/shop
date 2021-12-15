module.exports = class ApiFeatures {
  constructor(expressQuery, mongooseQuery) {
    this.expressQuery = expressQuery;
    this.mongooseQuery = mongooseQuery;
  }

  getQuery() {
    let query = { ...this.expressQuery };
    const exceptionQueries = ['page', 'itemsPerView', 'limit', 'fields', 'search'];
    exceptionQueries.forEach(item => delete query[item]);
    query = JSON.stringify(query).replace(
      /\b(gt|gte|lte|lt)\b/, 
      (match) => `$${match}`
    );
    query = JSON.parse(query);
    return query;
  }

  filter() {
    const query = this.getQuery();
    this.mongooseQuery = this.mongooseQuery.find(query);
    return this;
  }

  limit() {
    const limit = this.expressQuery.limit || 25;
    this.mongooseQuery = this.mongooseQuery.limit(limit);
    return this;
  }

  project() {
    if (this.expressQuery.fields) {
      const fields = this.expressQuery.fields.split(',')
      this.mongooseQuery = this.mongooseQuery.select(fields);
    }
    return this;
  }

  paginate() {
    const itemsPerView = this.expressQuery.itemsPerView || 25;
    if (this.expressQuery.page) {
      const skip = (this.expressQuery.page - 1) * itemsPerView;
      this.mongooseQuery = this.mongooseQuery.skip(skip).limit(itemsPerView);
    } else {
      this.mongooseQuery = this.mongooseQuery.limit(itemsPerView);
    }
    return this;
  }
}