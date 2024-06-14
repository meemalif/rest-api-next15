import { Types } from "mongoose";
import { NextResponse } from "next/server";

import connect from "@/lib/db";
import User from "@/lib/modals/user";
import Category from "@/lib/modals/category";
import Blog from "@/lib/modals/blog";
import { request } from "http";

export const GET = async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const categoryId = searchParams.get("categoryId");
    const searchKeywords = searchParams.get("keywords") as string;
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse("Invalid user id", { status: 400 });
    }

    if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
      return new NextResponse("Invalid category id", { status: 400 });
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

    const filter: any = {
      user: new Types.ObjectId(userId),
      category: new Types.ObjectId(categoryId),
    };

    //Todo
    if (searchKeywords) {
      filter.$or = [
        { title: { $regex: searchKeywords, $options: "i" } },
        { description: { $regex: searchKeywords, $options: "i" } },
      ];
    }

    const blogs = await Blog.find(filter);

    return new NextResponse(
      JSON.stringify({ message: "Blogs are", blogs: blogs }),
      { status: 200 }
    );
  } catch (error: any) {
    return new NextResponse("Error in getting Blogs" + error.message, {
      status: 500,
    });
  }
};

export const POST = async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const categoryId = searchParams.get("categoryId");
    const { title, description } = await request.json();

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse("Invalid user id", { status: 400 });
    }

    if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
      return new NextResponse("Invalid category id", { status: 400 });
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

    const newBlog = new Blog({
      title,
      description,
      user: new Types.ObjectId(userId),
      category: new Types.ObjectId(categoryId),
    });

    await newBlog.save();

    return new NextResponse(
      JSON.stringify({ message: "Blog is created", blog: newBlog }),
      { status: 201 }
    );
  } catch (error: any) {
    return new NextResponse("Error in creating Blog" + error.message, {
      status: 500,
    });
  }
};
