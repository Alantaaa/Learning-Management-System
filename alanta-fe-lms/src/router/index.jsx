import { createBrowserRouter, redirect } from "react-router-dom";
import ManagerHome from "../pages/manager/home";
import SignInPage from "../pages/SignIn";
import SignUpPage from "../pages/SignUp";
import SuccessCheckoutPage from "../pages/SuccessCheckout";
import LayoutDashboard from "../components/layout";
import ManageCoursePage from "../pages/manager/courses";
import ManageCrateCoursePage from "../pages/manager/create-course";
import ManageCourseDetailPage from "../pages/manager/course-detail";
import ManageContentCreatePage from "../pages/manager/course-content-create";
import ManageCreateCoursePage from "../pages/manager/create-course";
import ManageCoursePreviewPage from "../pages/manager/course-preview";
import ManageStudentsPage from "../pages/manager/students";
import StudentPage from "../pages/student/StudentOverview";
import secureLocalStorage from "react-secure-storage";
import { STORAGE_KEY } from "../utils/const";
import { MANAGER_SESSION } from "../utils/const";
import {
  getCategories,
  getCourses,
  getCoursesDetail,
  getDetailContent,
} from "../services/courseService";

const router = createBrowserRouter([
  {
    path: "/",
    element: <ManagerHome />,
  },
  {
    path: "/manager/sign-in",
    element: <SignInPage />,
  },
  {
    path: "/manager/sign-up",
    element: <SignUpPage />,
  },
  {
    path: "/success-checkout",
    element: <SuccessCheckoutPage />,
  },
  {
    path: "/manager",
    id: MANAGER_SESSION,
    loader: async () => {
      try {
        const session = secureLocalStorage.getItem(STORAGE_KEY);

        if (!session) {
          throw redirect("/manager/sign-in");
        }

        const sessionData =
          typeof session === "string" ? JSON.parse(session) : session;

        if (sessionData?.role !== "manager") {
          throw redirect("/manager/sign-in");
        }

        return sessionData;
      } catch (error) {
        if (error instanceof Error && error.status === 302) {
          throw error;
        }
        throw redirect("/manager/sign-in");
      }
    },
    element: <LayoutDashboard />,
    children: [
      {
        index: true,
        element: <ManagerHome />,
      },
      {
        path: "courses",
        loader: async () => {
          try {
            const session = secureLocalStorage.getItem(STORAGE_KEY);

            if (!session) {
              throw redirect("/manager/sign-in");
            }

            const sessionData =
              typeof session === "string" ? JSON.parse(session) : session;

            if (sessionData?.role !== "manager") {
              throw redirect("/manager/sign-in");
            }

            // getCourses sudah handle token via apiInstanceAuth
            const data = await getCourses();
            return data;
          } catch (error) {
            // Jika error 401 atau 403, redirect ke login
            if (
              error.response?.status === 401 ||
              error.response?.status === 403
            ) {
              secureLocalStorage.removeItem(STORAGE_KEY);
              throw redirect("/manager/sign-in");
            }

            // Error lainnya (network error, 500, dll), return data kosong dengan error message
            console.error("Error fetching courses:", error);
            return {
              courses: [],
              error: error.message || "Failed to fetch courses",
            };
          }
        },
        element: <ManageCoursePage />,
      },
      {
        path: "courses/create",
        loader: async () => {
          const categories = await getCategories();

          return { categories, course: null };
        },
        element: <ManageCreateCoursePage />,
      },
      {
        path: "courses/edit/:id",
        loader: async ({ params }) => {
          const categories = await getCategories();
          const course = await getCoursesDetail(params.id);

          return { categories, course: course?.data };
        },
        element: <ManageCreateCoursePage />,
      },
      {
        path: "courses/:id",
        loader: async ({ params }) => {
          const course = await getCoursesDetail(params.id);
          return course?.data;

          try {
            const session = secureLocalStorage.getItem(STORAGE_KEY);

            if (!session) {
              throw redirect("/manager/sign-in");
            }

            const sessionData =
              typeof session === "string" ? JSON.parse(session) : session;

            const token = sessionData?.token;

            if (!token) {
              throw redirect("/manager/sign-in");
            }

            // Fetch detail course jika ada service-nya
            // const data = await getCourseDetail(params.id, token);
            // return data;

            return params;
          } catch (error) {
            if (error instanceof Error && error.status === 302) {
              throw error;
            }
            if (error.response?.status === 401) {
              secureLocalStorage.removeItem(STORAGE_KEY);
              throw redirect("/manager/sign-in");
            }
            throw redirect("/manager/sign-in");
          }
        },
        element: <ManageCourseDetailPage />,
      },
      {
        path: "courses/:id/create",
        element: <ManageContentCreatePage />,
      },
      {
        path: "/manager/courses/:id/edit/:contentId",
        loader: async ({ params }) => {
          const content = await getDetailContent(params.contentId);

          return content?.data;
        },
        element: <ManageContentCreatePage />,
      },
      {
        path: "courses/:id/preview",
        loader: async ({ params }) => {
          const course = await getCoursesDetail(params.id, true);

          return course?.data;
        },
        element: <ManageCoursePreviewPage />,
      },
      {
        path: "students",
        loader: async () => {
          try {
            const session = secureLocalStorage.getItem(STORAGE_KEY);

            if (!session) {
              return { students: [], error: "No session found" };
            }

            const sessionData =
              typeof session === "string" ? JSON.parse(session) : session;

            const token = sessionData?.token;

            if (!token) {
              return { students: [], error: "No token found" };
            }

            // Fetch students data jika ada service-nya
            // const data = await getStudents(token);
            // return data;

            return { students: [], data: sessionData };
          } catch (error) {
            if (
              error.response?.status === 401 ||
              error.response?.status === 403
            ) {
              secureLocalStorage.removeItem(STORAGE_KEY);
              throw redirect("/manager/sign-in");
            }

            console.error("Error fetching students:", error);
            return {
              students: [],
              error: error.message || "Failed to fetch students",
            };
          }
        },
        element: <ManageStudentsPage />,
      },
    ],
  },
  {
    path: "/student",
    loader: async () => {
      try {
        const session = secureLocalStorage.getItem(STORAGE_KEY);

        if (!session) {
          throw redirect("/manager/sign-in");
        }

        const sessionData =
          typeof session === "string" ? JSON.parse(session) : session;

        if (sessionData?.role !== "student") {
          throw redirect("/manager/sign-in");
        }

        return sessionData;
      } catch (error) {
        if (error instanceof Error && error.status === 302) {
          throw error;
        }
        throw redirect("/manager/sign-in");
      }
    },
    element: <LayoutDashboard isAdmin={false} />,
    children: [
      {
        index: true,
        element: <StudentPage />,
      },
      {
        path: "detail-course/:id",
        loader: async ({ params }) => {
          try {
            const session = secureLocalStorage.getItem(STORAGE_KEY);

            if (!session) {
              throw redirect("/manager/sign-in");
            }

            const sessionData =
              typeof session === "string" ? JSON.parse(session) : session;

            const token = sessionData?.token;

            if (!token) {
              throw redirect("/manager/sign-in");
            }

            // Fetch course detail untuk student
            // const data = await getStudentCourseDetail(params.id, token);
            // return data;

            return params;
          } catch (error) {
            if (error instanceof Error && error.status === 302) {
              throw error;
            }
            if (error.response?.status === 401) {
              secureLocalStorage.removeItem(STORAGE_KEY);
              throw redirect("/manager/sign-in");
            }
            throw redirect("/manager/sign-in");
          }
        },
        element: <ManageCoursePreviewPage />,
      },
    ],
  },
]);

export default router;
