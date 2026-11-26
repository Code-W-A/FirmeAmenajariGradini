import "@/public/assets/scss/dashbord_navitaion.css";
import "@/public/assets/scss/components/_dashboard.scss";

export const metadata = {
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function AdminLayout({ children }) {
  return children;
}
