import { Search, Home, Grid3X3, Library, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchBar } from "./SearchBar";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

interface HeaderProps {
  onItemAdded?: () => void;
}

export function Header({ onItemAdded }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-vault-dark/95 backdrop-blur-sm border-b border-vault-gray sticky top-0 z-50">
      <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2 flex-shrink-0">
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-vault-red rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-base sm:text-lg">MV</span>
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-foreground">
              Movie Vault
            </h1>
          </div>

          {/* Search Bar (desktop, only on /search) */}
          {location.pathname === "/search" && (
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <SearchBar onItemAdded={onItemAdded} />
            </div>
          )}

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-2">
            <Button
              asChild
              variant={isActive("/") ? "default" : "ghost"}
              size="sm"
              className={isActive("/") ? "bg-vault-red hover:bg-vault-red-hover" : ""}
            >
              <Link to="/">
                <Home className="h-4 w-4 mr-2" />
                Home
              </Link>
            </Button>

            <Button
              asChild
              variant={isActive("/search") ? "default" : "ghost"}
              size="sm"
              className={isActive("/search") ? "bg-vault-red hover:bg-vault-red-hover" : ""}
            >
              <Link to="/search">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Link>
            </Button>

            <Button
              asChild
              variant={isActive("/collections") ? "default" : "ghost"}
              size="sm"
              className={
                isActive("/collections") ? "bg-vault-red hover:bg-vault-red-hover" : ""
              }
            >
              <Link to="/collections">
                <Grid3X3 className="h-4 w-4 mr-2" />
                Collections
              </Link>
            </Button>

            <Button
              asChild
              variant={isActive("/vault") ? "default" : "ghost"}
              size="sm"
              className={isActive("/vault") ? "bg-vault-red hover:bg-vault-red-hover" : ""}
            >
              <Link to="/vault">
                <Library className="h-4 w-4 mr-2" />
                Vault
              </Link>
            </Button>
          </nav>

          {/* Mobile Menu Toggle */}
          <Button variant="ghost" size="sm" className="md:hidden" onClick={toggleMobileMenu}>
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Search Bar (on /search) */}
        {location.pathname === "/search" && (
          <div className="md:hidden mt-3 px-1">
            <SearchBar onItemAdded={onItemAdded} />
          </div>
        )}

        {/* Mobile Nav Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute left-0 right-0 top-full bg-vault-dark backdrop-blur-sm border-b border-vault-gray shadow-lg">
            <nav className="container mx-auto px-3 py-4 space-y-2">
              <Button
                asChild
                variant={isActive("/") ? "default" : "ghost"}
                size="sm"
                className={`w-full justify-start ${
                  isActive("/") ? "bg-vault-red hover:bg-vault-red-hover" : ""
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Link to="/">
                  <Home className="h-4 w-4 mr-3" />
                  Home
                </Link>
              </Button>

              <Button
                asChild
                variant={isActive("/search") ? "default" : "ghost"}
                size="sm"
                className={`w-full justify-start ${
                  isActive("/search") ? "bg-vault-red hover:bg-vault-red-hover" : ""
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Link to="/search">
                  <Search className="h-4 w-4 mr-3" />
                  Search
                </Link>
              </Button>

              <Button
                asChild
                variant={isActive("/collections") ? "default" : "ghost"}
                size="sm"
                className={`w-full justify-start ${
                  isActive("/collections") ? "bg-vault-red hover:bg-vault-red-hover" : ""
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Link to="/collections">
                  <Grid3X3 className="h-4 w-4 mr-3" />
                  Collections
                </Link>
              </Button>

              <Button
                asChild
                variant={isActive("/vault") ? "default" : "ghost"}
                size="sm"
                className={`w-full justify-start ${
                  isActive("/vault") ? "bg-vault-red hover:bg-vault-red-hover" : ""
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Link to="/vault">
                  <Library className="h-4 w-4 mr-3" />
                  Vault
                </Link>
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
