import SignIn from "../pages/SignIn/SignIn";
import NotFoundPage from "../pages/NotFoundPage/NotFoundPage";
import AdminPage from "../pages/AdminHomePage/AdminHomePage";
import PersonalPage from "../pages/PersonalPage/PersonalPage";
import ProductsPage from "../pages/ProductsPage/ProductsPage";
import EmployeeUsersPage from "../pages/EmployeeUsersPage/EmployeeUsersPage";
import CustomerUsersPage from "../pages/CustomerUsersPage/CustomerUsersPage";
import DiscountPage from "../pages/DiscountPage/DiscountPage";
import SaleHomePage from "../pages/SaleHomePage/SaleHomePage";
import SalePersonalPage from "../pages/PersonalPage/SalePersonalPage"
import OrderPage from "../pages/OrderPage/OrderPage";

export const routes = [
  {
    path: "/",
    page: SignIn,
  },

  {
    path: "/sign-in",
    page: SignIn,
  },

  {
    path: "/admin",
    page: AdminPage,
    requiresAuth: true, // Route này cần phải đăng nhập
    isAdmin: true,
  },
  {
    path: "/admin/home",
    page: AdminPage,
    requiresAuth: true, // Route này cần phải đăng nhập
    isAdmin: true,
  },
  {
    path: "/admin/personal-information",
    page: PersonalPage,
    requiresAuth: true, // Route này cần phải đăng nhập
    isAdmin: true,
  },
  {
    path: "/admin/product-management",
    page: ProductsPage,
    requiresAuth: true, // Route này cần phải đăng nhập
    isAdmin: true,
  },

  {
    path: "/admin/employee-management",
    page: EmployeeUsersPage,
    requiresAuth: true, // Route này cần phải đăng nhập
    isAdmin: true,
  },
  {
    path: "/admin/customer-management",
    page: CustomerUsersPage,
    requiresAuth: true, // Route này cần phải đăng nhập
    isAdmin: true,
  },
  {
    path: "/admin/discount-management",
    page: DiscountPage,
    requiresAuth: true, // Route này cần phải đăng nhập
    isAdmin: true,
  },
  {
    path: "/sale",
    page: SaleHomePage,
    requiresAuth: true,
    isSale: true
  },
  {
    path: "/sale/home",
    page: SaleHomePage,
    requiresAuth: true,
    isSale: true
  },
  {
    path: "/sale/order-management",
    page: OrderPage,
    requiresAuth: true,
    isSale: true
  },
  {
    path: "/sale/personal-information",
    page: SalePersonalPage,
    requiresAuth: true,
    isSale: true
  },
  {
    path: "*",
    page: NotFoundPage,
  },
];
