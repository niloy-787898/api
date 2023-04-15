const Blog = require("../models/blogsModel");
const asyncHandler = require("express-async-handler");
const { mongoValidateId } = require("../utils/validateMongoDB");
const cloudinaryUploadImg = require("../utils/cloudinary");
const fs = require("fs");

//create new blog
const createBlog = asyncHandler(async (req, res) => {
  try {
    const newBlog = await Blog.create(req.body);
    res.json(newBlog);
  } catch (error) {
    throw new Error(error);
  }
});

//update a Blog
const updateSingleBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  mongoValidateId(id);
  try {
    const updatedBlog = await Blog.findOneAndUpdate(id, req.body, {
      new: true,
    });
    res.json(updatedBlog);
  } catch (error) {
    throw new Error(error);
  }
});

//get singleBlog by id
const getSingleBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  mongoValidateId(id);
  try {
    const findBlogById = await Blog.findById(id).populate("likes").populate("dislikes");
    await Blog.findByIdAndUpdate(
      id,
      {
        $inc: { numView: 1 },
      },
      {
        new: true,
      }
    );
    res.json(findBlogById);
  } catch (error) {
    throw new Error(error);
  }
});

//get ALL Blog
const getAllBlog = asyncHandler(async (req, res) => {
  try {
    const getBlog = await Blog.find();
    res.json(getBlog);
  } catch (error) {
    throw new Error(error);
  }
});

//delete Blog
const deleteSingleBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  mongoValidateId(id);
  try {
    const deleteBlog = await Blog.findOneAndDelete(id);
    res.json(deleteBlog);
  } catch (error) {
    throw new Error(error);
  }
});

//like blog
const likeBlog = asyncHandler(async (req, res) => {
  const { blogId } = req.body;
  
  mongoValidateId(blogId);

  //find the blog which you want to liked
  const blog = await Blog.findById(blogId);
  //find the login uer
  const loginUserId = req?.user?.id;
  //find if the user likes the blog
  const isLiked = blog?.isLiked;
  //find if the user dislikes the blog
  const alreadyDisliked = blog?.dislikes?.find(
    ((userId) =>userId?.toString() === loginUserId?.toString())
  );
  if (alreadyDisliked) {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $pull: { dislikes: loginUserId },
        isDisliked: false,
      },
      {
        new: true,
      }
    );
    res.json(blog);
  }
  if (isLiked) {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $pull: { likes: loginUserId },
        isLiked: false,
      },
      {
        new: true,
      }
    );
    res.json(blog);
  } else {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $push: { likes: loginUserId },
        isLiked: true,
      },
      {
        new: true,
      }
    );
    res.json(blog);
  }
});

//dislike blog
const dislikeBlog = asyncHandler(async (req, res) => {
  const { blogId } = req.body;
  console.log(blogId);
  
  mongoValidateId(blogId);

  //find the blog which you want to liked
  const blog = await Blog.findById(blogId);
  //find the login uer
  const loginUserId = req?.user?.id;
  //find if the user likes the blog
  const isDisLiked = blog?.isDisliked;
  //find if the user dislikes the blog
  const alreadyLiked = blog?.likes?.find(
    ((userId) =>userId?.toString() === loginUserId?.toString())
  );
  if (alreadyLiked) {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $pull: { likes: loginUserId },
        isLiked: false,
      },
      {
        new: true,
      }
    );
    res.json(blog);
  }
  if (isDisLiked) {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $pull: { dislikes: loginUserId },
        isDisliked: false,
      },
      {
        new: true,
      }
    );
    res.json(blog);
  } else {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $push: { dislikes: loginUserId },
        isDisliked: true,
      },
      {
        new: true,
      }
    );
    res.json(blog);
  }
});

//upload images
const uploadImages = asyncHandler(async (req, res) => {
  const { id } = req.params;
  mongoValidateId(id);
  try {
    const uploader = (path) => cloudinaryUploadImg(path, "images");
    urls = [];
    const files = req.files;
    for (let file of files) {
      const { path } = file;
      const newpath = await uploader(path);
      urls.push(newpath);
      fs.unlinkSync(path);
    }
    const findBlog = await Blog.findByIdAndUpdate(
      id,
      {
        images: urls.map((file) => {
          return file;
        }),
      },
      {
        new: true,
      }
    );
    res.json(findBlog);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createBlog,
  updateSingleBlog,
  getSingleBlog,
  getAllBlog,
  deleteSingleBlog,
  likeBlog,
  dislikeBlog,
  uploadImages,
};
