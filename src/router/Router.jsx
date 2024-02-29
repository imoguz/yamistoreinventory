import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "../pages/Login";
import PrivateRouter from "./PrivateRouter";
import Dashboard from "../pages/Dashboard";
import Home from "../pages/Home";
import PageNotFound from "../pages/PageNotFound";
import ColorDataGrid from "../pages/atributes/ColorDataGrid";
import SizeDataGrid from "../pages/atributes/SizeDataGrid";
import VariantDataGrid from "../pages/atributes/VariantDataGrid";
import DiscountDataGrid from "../pages/atributes/DiscountDataGrid";
import PromotionDataGrid from "../pages/atributes/PromotionDataGrid";
import CategoryDataGrid from "../pages/atributes/CategoryDataGrid";
import Attribute from "../pages/Attribute";
import ProductDataGrid from "../pages/Product";
import Brand from "../pages/Brand";
import Settings from "../pages/Settings";
import BannerData from "../pages/settings/BannerData";
import Store from "../pages/Store";

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PrivateRouter />}>
          <Route path="" element={<Dashboard />}>
            <Route index element={<Home />} />
            <Route path="attributes">
              <Route index element={<Attribute />} />
              <Route path="color" element={<ColorDataGrid />} />
              <Route path="size" element={<SizeDataGrid />} />
              <Route path="variant" element={<VariantDataGrid />} />
              <Route path="discount" element={<DiscountDataGrid />} />
              <Route path="promotion" element={<PromotionDataGrid />} />
              <Route path="category" element={<CategoryDataGrid />} />
            </Route>
            <Route path="product" element={<ProductDataGrid />} />
            <Route path="brand" element={<Brand />} />
            <Route path="store" element={<Store />} />
            <Route path="settings">
              <Route index element={<Settings />} />
              <Route path="banner" element={<BannerData />} />
            </Route>
          </Route>
        </Route>
        <Route path="*" element={<PageNotFound />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
