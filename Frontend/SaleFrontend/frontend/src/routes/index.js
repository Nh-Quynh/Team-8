import SignIn from "../pages/SignIn/SignIn";
import NotFoundPage from "../pages/NotFoundPage/NotFoundPage";
import SaleHomePage from "../pages/SaleHomePage/SaleHomePage";
import SalePersonalPage from "../pages/PersonalPage/SalePersonalPage";
import OrderPage from "../pages/OrderPage/OrderPage";
import NewsPage from "../pages/NewsPage/NewsPage";

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
    path: "/sale",
    page: SaleHomePage,
    requiresAuth: true,
    requiresSales: true,
    requiresStatus: true,
  },
  {
    path: "/sale/home",
    page: SaleHomePage,
    requiresAuth: true,
    requiresSales: true,
    requiresStatus: true,
  },
  {
    path: "/sale/order-management",
    page: OrderPage,
    requiresAuth: true,
    requiresSales: true,
    requiresStatus: true,
  },
  {
    path: "/sale/personal-information",
    page: SalePersonalPage,
    requiresAuth: true,
    requiresSales: true,
    requiresStatus: true,
  },
  {
    path: "/sale/news-management",
    page: NewsPage,
    requiresAuth: true,
    requiresSales: true,
    requiresStatus: true,
  },
  {
    path: "*",
    page: NotFoundPage,
  },
];
