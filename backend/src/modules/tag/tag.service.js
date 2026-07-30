const createTagService = require("./services/create-tag.service");
const getTagsService = require("./services/get-tags.service");
const getTagService = require("./services/get-tag.service");
const updateTagService = require("./services/update-tag.service");
const deleteTagService = require("./services/delete-tag.service");
const restoreTagService = require("./services/restore-tag.service");

/**
 * ==========================================================
 * Tag Service Aggregator Facade
 * ==========================================================
 * Central entry point for all Tag domain business services.
 * ==========================================================
 */

module.exports = {
  createTag: (payload, userId) => createTagService.execute(payload, userId),
  getTags: (query) => getTagsService.execute(query),
  getTagById: (id) => getTagService.execute(id),
  updateTag: (id, payload, userId) => updateTagService.execute(id, payload, userId),
  deleteTag: (id, userId) => deleteTagService.execute(id, userId),
  restoreTag: (id, userId) => restoreTagService.execute(id, userId),

  createTagService,
  getTagsService,
  getTagService,
  updateTagService,
  deleteTagService,
  restoreTagService,
};
