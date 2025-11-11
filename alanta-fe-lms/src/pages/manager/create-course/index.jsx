import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useLoaderData, useNavigate, useParams } from "react-router-dom";
import {
  createCourseSchema,
  updateCourseSchema,
} from "../../../utils/zodSchema";
import { useMutation } from "@tanstack/react-query";
import { createCourse, updateCourse } from "../../../services/courseService";

export default function ManageCreateCoursePage() {
  const data = useLoaderData();
  const { id } = useParams();
  const navigate = useNavigate();
  const inputFileRef = useRef(null);

  const [file, setFile] = useState(null); // bisa berupa File object (baru) atau string URL (lama)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm({
    resolver: zodResolver(
      data.course === null ? createCourseSchema : updateCourseSchema
    ),
    defaultValues: {
      name: data?.course?.name || "",
      tagline: data?.course?.tagline || "",
      categoryId: "",
      description: data?.course?.description || "",
    },
  });

  const mutateCreate = useMutation({
    mutationFn: (data) => createCourse(data),
  });

  const mutateUpdate = useMutation({
    mutationFn: (data) => updateCourse(data, id),
  });

  // ✅ Prefill data course untuk mode edit
  useEffect(() => {
    if (data?.course) {
      // cari _id kategori berdasarkan name karena dari API hanya ada category.name
      const matchedCategory = data?.categories?.data?.find(
        (item) => item.name === data.course.category?.name
      );

      reset({
        name: data.course.name || "",
        tagline: data.course.tagline || "",
        categoryId: matchedCategory?._id || "",
        description: data.course.description || "",
      });

      // isi file dari thumbnail lama (pakai thumbnail_url kalau ada)
      if (data.course.thumbnail_url) {
        setFile(data.course.thumbnail_url);
      }
    }
  }, [data, reset]);

  // ✅ handle submit create/update
  const onSubmit = async (values) => {
    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("tagline", values.tagline);
      formData.append("categoryId", values.categoryId);
      formData.append("description", values.description);

      // hanya kirim thumbnail baru kalau user upload baru
      if (file && typeof file !== "string") {
        formData.append("thumbnail", file);
      }

      if (data.course === null) {
        await mutateCreate.mutateAsync(formData);
      } else {
        await mutateUpdate.mutateAsync(formData);
      }

      navigate("/manager/courses");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <header className="flex items-center justify-between gap-[30px]">
        <div>
          <h1 className="font-extrabold text-[28px] leading-[42px]">
            {data.course ? "Edit Course" : "New Course"}
          </h1>
          <p className="text-[#838C9D] mt-[1]">
            {data.course
              ? "Update your existing course"
              : "Create new future for company"}
          </p>
        </div>
      </header>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col w-[550px] rounded-[30px] p-[30px] gap-[30px] bg-[#F8FAFB]"
      >
        {/* Course Name */}
        <div className="flex flex-col gap-[10px]">
          <label htmlFor="title" className="font-semibold">
            Course Name
          </label>
          <div className="flex items-center w-full rounded-full border border-[#CFDBEF] gap-3 px-5 transition-all duration-300 focus-within:ring-2 focus-within:ring-[#662FFF]">
            <img
              src="/assets/images/icons/note-favorite-black.svg"
              className="w-6 h-6"
              alt="icon"
            />
            <input
              {...register("name")}
              type="text"
              id="title"
              className="appearance-none outline-none w-full py-3 font-semibold placeholder:font-normal placeholder:text-[#838C9D] !bg-transparent"
              placeholder="Write better name for your course"
            />
          </div>
          <span className="error-message text-[#FF435A]">
            {errors?.name?.message}
          </span>
        </div>

        {/* Thumbnail */}
        <div className="relative flex flex-col gap-[10px]">
          <label htmlFor="thumbnail" className="font-semibold">
            Add a Thumbnail
          </label>
          <div
            id="thumbnail-preview-container"
            className="relative flex shrink-0 w-full h-[200px] rounded-[20px] border border-[#CFDBEF] overflow-hidden"
          >
            <button
              type="button"
              id="trigger-input"
              onClick={() => inputFileRef?.current?.click()}
              className="absolute top-0 left-0 w-full h-full flex justify-center items-center gap-3 z-0"
            >
              <img
                src="/assets/images/icons/gallery-add-black.svg"
                className="w-6 h-6"
                alt="icon"
              />
              <span className="text-[#838C9D]">Add an attachment</span>
            </button>

            {/* ✅ Preview thumbnail lama atau baru */}
            <img
              id="thumbnail-preview"
              src={
                file
                  ? typeof file === "string"
                    ? file // URL lama dari backend
                    : URL.createObjectURL(file) // file baru dari input
                  : null
              }
              className={`w-full h-full object-cover ${file ? "block" : "hidden"}`}
              alt="thumbnail"
            />

            <button
              type="button"
              id="delete-preview"
              onClick={() => {
                setFile(null);
                setValue("thumbnail", null);
              }}
              className={`absolute right-[10px] bottom-[10px] w-12 h-12 rounded-full bg-[#FF435A] flex justify-center items-center ${
                file ? "flex" : "hidden"
              }`}
            >
              <img src="/assets/images/icons/delete.svg" alt="delete" />
            </button>
          </div>

          <input
            {...register("thumbnail")}
            ref={inputFileRef}
            type="file"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                setFile(e.target.files[0]);
                setValue("thumbnail", e.target.files[0]);
              }
            }}
            id="thumbnail"
            accept="image/*"
            className="absolute bottom-0 left-1/4 -z-10"
          />

          <span className="error-message text-[#FF435A]">
            {errors?.thumbnail?.message}
          </span>
        </div>

        {/* Tagline */}
        <div className="flex flex-col gap-[10px]">
          <label htmlFor="tagline" className="font-semibold">
            Course Tagline
          </label>
          <div className="flex items-center w-full rounded-full border border-[#CFDBEF] gap-3 px-5 transition-all duration-300 focus-within:ring-2 focus-within:ring-[#662FFF]">
            <img
              src="/assets/images/icons/bill-black.svg"
              className="w-6 h-6"
              alt="icon"
            />
            <input
              {...register("tagline")}
              type="text"
              id="tagline"
              className="appearance-none outline-none w-full py-3 font-semibold placeholder:font-normal placeholder:text-[#838C9D] !bg-transparent"
              placeholder="Write tagline for better copy"
            />
          </div>
          <span className="error-message text-[#FF435A]">
            {errors?.tagline?.message}
          </span>
        </div>

        {/* Category */}
        <div className="flex flex-col gap-[10px]">
          <label htmlFor="category" className="font-semibold">
            Select Category
          </label>
          <div className="flex items-center w-full rounded-full border border-[#CFDBEF] gap-3 px-5 transition-all duration-300 focus-within:ring-2 focus-within:ring-[#662FFF]">
            <img
              src="/assets/images/icons/bill-black.svg"
              className="w-6 h-6"
              alt="icon"
            />
            <select
              {...register("categoryId")}
              id="category"
              className="appearance-none outline-none w-full py-3 px-2 -mx-2 font-semibold placeholder:font-normal placeholder:text-[#838C9D] !bg-transparent"
            >
              <option value="" hidden>
                Choose one category
              </option>
              {data?.categories?.data?.map((item) => (
                <option key={item._id} value={item._id}>
                  {item.name}
                </option>
              ))}
            </select>
            <img
              src="/assets/images/icons/arrow-down.svg"
              className="w-6 h-6"
              alt="icon"
            />
          </div>
          <span className="error-message text-[#FF435A]">
            {errors?.categoryId?.message}
          </span>
        </div>

        {/* Description */}
        <div className="flex flex-col gap-[10px]">
          <label htmlFor="desc" className="font-semibold">
            Description
          </label>
          <div className="flex w-full rounded-[20px] border border-[#CFDBEF] gap-3 p-5 transition-all duration-300 focus-within:ring-2 focus-within:ring-[#662FFF]">
            <img
              src="/assets/images/icons/note-black.png"
              className="w-6 h-6"
              alt="icon"
            />
            <textarea
              {...register("description")}
              id="desc"
              rows="5"
              className="appearance-none outline-none w-full font-semibold placeholder:font-normal placeholder:text-[#838C9D] !bg-transparent"
              placeholder="Explain what this course about"
            ></textarea>
          </div>
          <span className="error-message text-[#FF435A]">
            {errors?.description?.message}
          </span>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-[14px]">
          <button
            type="button"
            className="w-full rounded-full border border-[#060A23] p-[14px_20px] font-semibold text-nowrap"
          >
            Save as Draft
          </button>
          <button
            type="submit"
            disabled={
              data?.course === null
                ? mutateCreate.isLoading
                : mutateUpdate.isLoading
            }
            className="w-full rounded-full p-[14px_20px] font-semibold text-[#FFFFFF] bg-[#662FFF] text-nowrap"
          >
            {data.course ? "Update Course" : "Create Now"}
          </button>
        </div>
      </form>
    </>
  );
}
