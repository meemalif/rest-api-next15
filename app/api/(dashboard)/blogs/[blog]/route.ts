import { Types } from "mongoose";
import { NextResponse } from "next/server";

import connect from "@/lib/db";
import User from "@/lib/modals/user";
import Category from "@/lib/modals/category";
import Blog from "@/lib/modals/blog";

export const GET = async (request: Request, context: { params: any }) => {
  const blogId = context.params.blog;
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const categoryId = searchParams.get("categoryId");

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse("Invalid user id", { status: 400 });
    }

    if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
      return new NextResponse("Invalid category id", { status: 400 });
    }

    if (!blogId || !Types.ObjectId.isValid(blogId)) {
      return new NextResponse("Invalid blog id", { status: 400 });
    }

    await connect();

    const user = await User.findById(userId);
    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    const category = await Category.findById(categoryId);
    if (!category) {
      return new NextResponse("Category not found", { status: 404 });
    }

    const blog = await Blog.findOne({
      _id: blogId,
      user: userId,
      category: categoryId,
    });

    if (!blog) {
      return new NextResponse("Blog not found", { status: 404 });
    }

    return new NextResponse(JSON.stringify(blog), { status: 200 });
  } catch (error: any) {
    return new NextResponse("Error in getting Blogs" + error.message, {
      status: 500,
    });
  }
};

export const PATCH = async (request: Request, context: { params: any }) => {
  const blogId = context.params.blog;
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    const { title, description } = await request.json();

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse("Invalid user id", { status: 400 });
    }

    if (!blogId || !Types.ObjectId.isValid(blogId)) {
      return new NextResponse("Invalid blog id", { status: 400 });
    }

    if (!title || !description) {
      return new NextResponse("Title and description is required", {
        status: 400,
      });
    }

    await connect();

    const user = await User.findById(userId);
    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    const blog = await Blog.findOne({
      _id: blogId,
      user: userId,
    });

    if (!blog) {
      return new NextResponse("Blog not found", { status: 404 });
    }
    const updatedBlog = await Blog.findByIdAndUpdate(
      blogId,
      { title, description },
      { new: true }
    );

    return new NextResponse(
      JSON.stringify({
        message: "Blog Updated",
        blog: updatedBlog,
      }),
      { status: 200 }
    );
  } catch (error: any) {
    return new NextResponse("Error updating blog blog" + error.message, {
      status: 500,
    });
  }
};

export const DELETE = async (request: Request, context: { params: any }) => {
  const blogId = context.params.blog;
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    if (!blogId || !Types.ObjectId.isValid(blogId)) {
      return new NextResponse("Invalid blog id", { status: 400 });
    }

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse("Invalid user id", { status: 400 });
    }

    await connect();
    const blog = await Blog.findOne({
      _id: blogId,
      user: userId,
    });
    if (!blog) {
      return new NextResponse("Blog not found", { status: 404 });
    }

    await Blog.findByIdAndDelete(blogId);

    return new NextResponse(JSON.stringify({ message: "Blog Deleted" }), {
      status: 200,
    });
  } catch (error: any) {
    return new NextResponse("Error in deleting blog" + error.message, {
      status: 500,
    });
  }
};
