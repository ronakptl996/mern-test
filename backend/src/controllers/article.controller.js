import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Article } from "../models/article.model.js";

const addArticle = asyncHandler(async (req, res) => {
  console.log(req.body);

  const { title, description, category, slug } = req.body;

  if (!title || !description || !category || !slug) {
    return res
      .status(404)
      .json(new ApiResponse(404, {}, "All field is required!"));
  }

  const existedArticle = await Article.findOne({ slug });

  if (existedArticle) {
    return res
      .status(404)
      .json(new ApiResponse(404, {}, "Slug already exist!"));
  }

  try {
    const articleData = await Article.create({
      title,
      description,
      slug,
      category,
      createdBy: req.user._id,
    });

    const createdData = await Article.findById(articleData._id);

    if (!createdData) {
      throw new ApiError(500, "Something went wrong while registering");
    }

    return res
      .status(201)
      .json(new ApiResponse(201, createdData, "Article add successfully"));
  } catch (error) {
    console.log({ error });
    throw new ApiError(500, "Error while add article");
  }
});

const checkSlugArticle = asyncHandler(async (req, res) => {
  const { slug } = req.query;

  if (!slug) {
    throw new ApiError(404, "Slug is required!");
  }

  try {
    const articleData = await Article.findOne({
      slug,
    });

    if (articleData) {
      return res
        .status(400)
        .json(new ApiResponse(400, [], "Slug already exist"));
    }

    return res.status(200).json(new ApiResponse(200, [], ""));
  } catch (error) {
    console.log({ error });
    throw new ApiError(500, "Something went wrong!");
  }
});

const populateCreatedBy = async (articles) => {
  const populatedArticles = await Article.populate(articles, {
    path: "createdBy",
    select: "username _id",
  });

  return populatedArticles;
};

const getSearchArticle = asyncHandler(async (req, res) => {
  const { q = "", sortField = "createdAt", sortBy = "desc" } = req.query;

  try {
    const searchQuery = new RegExp(q, "i");

    const pipelineStages = [
      {
        $match: {
          $or: [{ title: searchQuery }, { description: searchQuery }],
        },
      },
      {
        $project: {
          title: 1,
          description: 1,
          createdAt: 1,
          _id: 1,
          createdBy: 1,
          category: 1,
          slug: 1,
        },
      },
      {
        $sort: { [sortField]: sortBy === "asc" ? 1 : -1 },
      },
    ];

    const articles = await Article.aggregate(pipelineStages);

    const populatedArticles = await populateCreatedBy(articles);

    return res.status(200).json(new ApiResponse(200, populatedArticles, ""));
  } catch (error) {
    console.log({ error });
    throw new ApiError(500, "Something went wrong while get articles!");
  }
});

const updateArticle = asyncHandler(async (req, res) => {
  const { title, description, articleId } = req.body;

  if (!articleId || !title || !description) {
    return res
      .status(404)
      .json(new ApiResponse(404, {}, "All field is required!"));
  }

  const articleData = await Article.findById(articleId);

  if (!articleData) {
    return res.status(404).json(new ApiResponse(404, {}, "Article not found!"));
  }

  if (articleData.createdBy.toString() !== req.user._id.toString()) {
    return res
      .status(404)
      .json(new ApiResponse(404, {}, "You can not update this article!"));
  }

  try {
    const updatedData = await Article.findByIdAndUpdate(
      articleId,
      {
        title,
        description,
      },
      { new: true }
    );

    if (!updatedData) {
      return res
        .status(500)
        .json(new ApiResponse(500, [], "Error while updating article!"));
    }

    return res
      .status(200)
      .json(new ApiResponse(200, updatedData, "Article updated successfully"));
  } catch (error) {
    throw new ApiError(500, "Something went wrong!");
  }
});

const deleteArticle = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new ApiError(401, "Article ID is required!");
  }

  try {
    const data = await Article.findByIdAndDelete(id);

    if (!data) throw new ApiError(500, "Data not found!");

    return res
      .status(200)
      .json(new ApiResponse(200, data, "Article deleted successfully"));
  } catch (error) {
    throw new ApiError(500, "Error while delete article", error);
  }
});

export {
  addArticle,
  checkSlugArticle,
  getSearchArticle,
  updateArticle,
  deleteArticle,
};
