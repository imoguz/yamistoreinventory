import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import DesignServicesIcon from "@mui/icons-material/DesignServices";
import StoreIcon from "@mui/icons-material/Store";
import SellIcon from "@mui/icons-material/Sell";
import QrCodeIcon from "@mui/icons-material/QrCode";
import PaletteIcon from "@mui/icons-material/Palette";
import GpsFixedIcon from "@mui/icons-material/GpsFixed";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import StorefrontIcon from "@mui/icons-material/Storefront";
import AspectRatioIcon from "@mui/icons-material/AspectRatio";
import DiscountIcon from "@mui/icons-material/Discount";
import CampaignIcon from "@mui/icons-material/Campaign";
import CategoryIcon from "@mui/icons-material/Category";
import MergeTypeIcon from "@mui/icons-material/MergeType";
import AssessmentIcon from "@mui/icons-material/Assessment";
import ColorDataGrid from "../pages/atributes/ColorDataGrid";
import SizeDataGrid from "../pages/atributes/SizeDataGrid";
import VariantDataGrid from "../pages/atributes/VariantDataGrid";
import DiscountDataGrid from "../pages/atributes/DiscountDataGrid";
import PromotionDataGrid from "../pages/atributes/PromotionDataGrid";
import CategoryDataGrid from "../pages/atributes/CategoryDataGrid";
import SettingsIcon from "@mui/icons-material/Settings";
import Grid4x4Icon from "@mui/icons-material/Grid4x4";

export const menuItems: IMenuItem[] = [
  {
    title: "Dashboards",
    icon: <DashboardIcon />,
    path: "/",
  },
  { title: "Product", icon: <QrCodeIcon />, path: "/product" },
  {
    title: "Product Attributes",
    icon: <DesignServicesIcon />,
    path: "/attributes",
  },
  { title: "Brands", icon: <SellIcon />, path: "/brand" },
  { title: "Store", icon: <StorefrontIcon />, path: "/store" },
  { title: "Purchases", icon: <ShoppingCartIcon />, path: "/stock" },
  { title: "Sales", icon: <PointOfSaleIcon />, path: "/stock" },
  { title: "Inventory Tracking", icon: <GpsFixedIcon />, path: "/stock" },
  { title: "Reporting", icon: <AssessmentIcon />, path: "/stock" },
  { title: "Settings & Layout", icon: <SettingsIcon />, path: "/settings" },
];

export const attributeMenuItems: ISubMenuItem[] = [
  { title: "Color", icon: <PaletteIcon />, path: <ColorDataGrid /> },
  { title: "Size", icon: <AspectRatioIcon />, path: <SizeDataGrid /> },
  { title: "Variant", icon: <MergeTypeIcon />, path: <VariantDataGrid /> },
  { title: "Discount", icon: <DiscountIcon />, path: <DiscountDataGrid /> },
  { title: "Promotion", icon: <CampaignIcon />, path: <PromotionDataGrid /> },
  { title: "Category", icon: <CategoryIcon />, path: <CategoryDataGrid /> },
];

export const settingMenuItems: ISubMenuItem[] = [
  { title: "Banner", icon: <PaletteIcon />, path: <ColorDataGrid /> },
  { title: "Menu", icon: <AspectRatioIcon />, path: <SizeDataGrid /> },
  { title: "Layout", icon: <Grid4x4Icon />, path: <SizeDataGrid /> },
];
