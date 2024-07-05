import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Article } from "../models/article.model.js";

const addArticle = asyncHandler(async (req, res) => {
  console.log(req.body);
  const { title, description, category, slug } = req.body;

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

export { addArticle, checkSlugArticle };
