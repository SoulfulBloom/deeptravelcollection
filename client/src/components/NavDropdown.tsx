import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'wouter';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NestedItem {
  label: string;
  href: string;
}

interface SubMenuItem {
  label: string;
  href: string;
  items?: NestedItem[];
}

interface SubMenuGroup {
  label: string;
  items: NestedItem[];
  href?: string;
}

interface MenuItem {
  label: string;
  href?: string;
  items?: (SubMenuItem | SubMenuGroup)[];
}

interface NavDropdownProps {
  label: string;
  items: MenuItem[];
  isActive?: boolean;
  className?: string;
  iconComponent?: React.ReactNode;
  onClick?: () => void;
}

const NavDropdown: React.FC<NavDropdownProps> = ({ 
  label, 
  items, 
  isActive = false,
  className = '',
  iconComponent,
  onClick
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [openSubMenus, setOpenSubMenus] = useState<{[key: string]: boolean}>({});
  const dropdownRef = useRef<HTMLDivElement>(null);
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  const toggleSubMenu = (label: string) => {
    setOpenSubMenus(prev => ({
      ...prev,
      [label]: !prev[label]
    }));
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) && isOpen) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Desktop styles
  const desktopTriggerStyle = cn(
    `${isActive ? 'border-primary text-primary' : 'border-transparent text-neutral-500 hover:border-neutral-300 hover:text-neutral-700'} 
    border-b-2 px-1 pt-1 font-medium text-base cursor-pointer inline-flex items-center transition-colors`,
    isOpen && !isActive && 'bg-neutral-50',
    className
  );

  const desktopDropdownStyle = cn(
    'absolute left-0 mt-1 w-56 origin-top-left z-50 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'
  );

  // Mobile styles
  const mobileTriggerStyle = cn(
    `${isActive ? 'bg-primary text-white' : 'text-neutral-700 hover:bg-neutral-100'} 
    block px-3 py-2 rounded-md font-medium cursor-pointer flex items-center justify-between w-full text-sm`,
    isOpen && !isActive && 'bg-neutral-100',
    className
  );
  
  const handleItemClick = (e: React.MouseEvent, hasSubItems: boolean) => {
    if (hasSubItems) {
      e.preventDefault();
    }
    
    if (onClick) {
      onClick();
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Desktop version */}
      <div className="hidden md:block">
        <button
          className={desktopTriggerStyle}
          onClick={() => setIsOpen(!isOpen)}
        >
          {iconComponent && <span className="mr-1">{iconComponent}</span>}
          {label}
          <ChevronDown 
            className={`ml-1 h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
          />
        </button>
        
        {isOpen && (
          <div className={desktopDropdownStyle}>
            <div className="p-2">
              {items.map((item, index) => (
                <div key={index}>
                  {item.items ? (
                    <div className="relative group">
                      <button
                        className="flex w-full items-center justify-between px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900 rounded-md"
                        onClick={() => toggleSubMenu(item.label)}
                      >
                        {item.label}
                        <ChevronRight className={`h-4 w-4 transition-transform duration-200 ${openSubMenus[item.label] ? 'rotate-90' : ''}`} />
                      </button>
                      
                      {openSubMenus[item.label] && (
                        <div className="pl-4 mt-1 space-y-1">
                          {item.items.map((subItem, subIndex) => (
                            <div key={subIndex}>
                              {subItem.items ? (
                                <div className="pl-2">
                                  <div className="font-medium text-sm text-neutral-500 px-3 py-1">{subItem.label}</div>
                                  <div className="pl-2 space-y-1">
                                    {subItem.items.map((nestedItem, nestedIndex) => (
                                      <Link key={nestedIndex} href={nestedItem.href} onClick={() => setIsOpen(false)}>
                                        <span className="block px-3 py-1 text-sm text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900 rounded-md">
                                          {nestedItem.label}
                                        </span>
                                      </Link>
                                    ))}
                                  </div>
                                </div>
                              ) : (
                                <Link href={subItem.href || '#'}>
                                  <span 
                                    className="block px-3 py-1 text-sm text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900 rounded-md"
                                    onClick={() => setIsOpen(false)}
                                  >
                                    {subItem.label}
                                  </span>
                                </Link>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link href={item.href || '#'}>
                      <span 
                        className="block px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900 rounded-md" 
                        onClick={(e) => handleItemClick(e, !!item.items)}
                      >
                        {item.label}
                      </span>
                    </Link>
                  )}
                  {index < items.length - 1 && (
                    <div className="my-1 border-t border-neutral-200"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Mobile version */}
      <div className="md:hidden w-full">
        <button
          className={mobileTriggerStyle}
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="flex items-center">
            {iconComponent && <span className="mr-2">{iconComponent}</span>}
            {label}
          </div>
          <ChevronDown 
            className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
          />
        </button>
        
        {isOpen && (
          <div className="pl-4 mt-1 space-y-1 bg-neutral-50 rounded-md">
            {items.map((item, index) => (
              <div key={index} className="py-1">
                {item.items ? (
                  <div>
                    <button
                      className="flex w-full items-center justify-between px-3 py-1 text-sm text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900 rounded-md"
                      onClick={() => toggleSubMenu(item.label)}
                    >
                      {item.label}
                      <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${openSubMenus[item.label] ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {openSubMenus[item.label] && (
                      <div className="pl-4 mt-1 space-y-1">
                        {item.items.map((subItem, subIndex) => (
                          <div key={subIndex}>
                            {subItem.items ? (
                              <div className="py-1">
                                <div className="font-medium text-xs text-neutral-500 px-3 py-1">{subItem.label}</div>
                                <div className="pl-2 space-y-1">
                                  {subItem.items.map((nestedItem, nestedIndex) => (
                                    <Link key={nestedIndex} href={nestedItem.href || '#'}>
                                      <span 
                                        className="block px-3 py-1 text-xs text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900 rounded-md"
                                        onClick={onClick}
                                      >
                                        {nestedItem.label}
                                      </span>
                                    </Link>
                                  ))}
                                </div>
                              </div>
                            ) : (
                              <Link href={subItem.href || '#'}>
                                <span 
                                  className="block px-3 py-1 text-xs text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900 rounded-md"
                                  onClick={onClick}
                                >
                                  {subItem.label}
                                </span>
                              </Link>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link href={item.href || '#'} onClick={onClick}>
                    <span className="block px-3 py-1 text-sm text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900 rounded-md">
                      {item.label}
                    </span>
                  </Link>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NavDropdown;