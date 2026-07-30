const createCategoryService = require("./services/create-category.service");
const getCategoriesService = require("./services/get-categories.service");
const getCategoryService = require("./services/get-category.service");
const updateCategoryService = require("./services/update-category.service");
const deleteCategoryService = require("./services/delete-category.service");
const restoreCategoryService = require("./services/restore-category.service");

/**
 * ==========================================================
 * Category Service Aggregator Facade
 * ==========================================================
 * Central entry point for all Category domain business services.
 * ==========================================================
 */

module.exports = {
  createCategory: (payload, userId) => createCategoryService.execute(payload, userId),
  getCategories: (query) => getCategoriesService.execute(query),
  getCategoryById: (id) => getCategoryService.execute(id),
  updateCategory: (id, payload, userId) => updateCategoryService.execute(id, payload, userId),
  deleteCategory: (id, userId) => deleteCategoryService.execute(id, userId),
  restoreCategory: (id, userId) => restoreCategoryService.execute(id, userId),

  createCategoryService,
  getCategoriesService,
  getCategoryService,
  updateCategoryService,
  deleteCategoryService,
  restoreCategoryService,
};
