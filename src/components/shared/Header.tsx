"use client";

import { Heart, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AccountPanel } from "../client/AccountPanel";
import { LeftSidebar } from "../client/LeftSidebar";
import { Badge } from "../ui/badge";
import { useAppSelector } from "@/redux/hook";
import { navLinks } from "@/utils/navLinks";

const Header = () => {
  const location = usePathname();
  const { cart: cartItems } = useAppSelector((state) => state.cart);
  const { wishlist: wishlistItems } = useAppSelector((state) => state.wishlist);

  const { user, token } = useAppSelector((state) => state.auth);

  return (
    <header className="py-5 lg:py-7 border-b sticky top-0 z-50 bg-white ">
      <div className="layout_container  flex justify-between gap-4 items-center">
        <div className="flex items-center gap-2">
          <LeftSidebar />
          <span className="text-lg font-bold">Tienda</span>
        </div>
        <nav className="hidden lg:flex gap-5 items-center">
          {navLinks.map((nav) => (
            <Link
              key={nav.path}
              href={nav.path}
              className={`text-slate-700 hover:text-green-500 ${
                location === nav.path && "font-extrabold text-green-600"
              }`}
            >
              {nav.route}
            </Link>
          ))}
        </nav>
        <div className="flex gap-3 items-center">
          <Link
            href="/wishlist"
            className="text-slate-700 hover:text-green-500"
          >
            <div className="relative">
              <Heart />{" "}
              <Badge
                variant="outline"
                className="absolute py-0 px-[4px] z-20 -top-2 -right-2 bg-green-500 text-white"
              >
                {wishlistItems.length}
              </Badge>
            </div>
          </Link>
          <Link href="/cart" className="text-slate-700 hover:text-green-500">
            <div className="relative">
              <ShoppingCart />{" "}
              <Badge
                variant="outline"
                className="absolute py-0 px-[2px] z-20 -top-2 -right-2 bg-green-500 text-white"
              >
                {cartItems.length}
              </Badge>
            </div>
          </Link>
          {token ? (
            <AccountPanel />
          ) : (
            <Link href="/login" className="text-slate-700 hover:text-green-500">
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
