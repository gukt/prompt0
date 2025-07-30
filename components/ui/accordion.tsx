import { cn } from "@/lib/utils";
import { ChevronDownIcon } from "lucide-react";
import React, { createContext, useContext, useState } from "react";

// Accordion Context
interface AccordionContextType {
  openItems: Set<string>;
  toggleItem: (value: string) => void;
  type: "single" | "multiple";
}

const AccordionContext = createContext<AccordionContextType | undefined>(undefined);

// Accordion Root
interface AccordionProps {
  type?: "single" | "multiple";
  defaultValue?: string | string[];
  className?: string;
  children: React.ReactNode;
}

const Accordion = React.forwardRef<HTMLDivElement, AccordionProps>(
  ({ type = "single", defaultValue, className, children, ...props }, ref) => {
    const [openItems, setOpenItems] = useState<Set<string>>(() => {
      if (defaultValue) {
        if (Array.isArray(defaultValue)) {
          return new Set(defaultValue);
        }
        return new Set([defaultValue]);
      }
      return new Set();
    });

    const toggleItem = (value: string) => {
      setOpenItems((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(value)) {
          newSet.delete(value);
        } else {
          if (type === "single") {
            newSet.clear();
          }
          newSet.add(value);
        }
        return newSet;
      });
    };

    return (
      <AccordionContext.Provider value={{ openItems, toggleItem, type }}>
        <div ref={ref} className={className} {...props}>
          {children}
        </div>
      </AccordionContext.Provider>
    );
  }
);
Accordion.displayName = "Accordion";

// Accordion Item
interface AccordionItemProps {
  value: string;
  className?: string;
  children: React.ReactNode;
}

const AccordionItem = React.forwardRef<HTMLDivElement, AccordionItemProps>(
  ({ value, className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("border-b", className)} {...props}>
        {children}
      </div>
    );
  }
);
AccordionItem.displayName = "AccordionItem";

// Accordion Trigger
interface AccordionTriggerProps {
  className?: string;
  children: React.ReactNode;
}

const AccordionTrigger = React.forwardRef<HTMLButtonElement, AccordionTriggerProps>(
  ({ className, children, ...props }, ref) => {
    const context = useContext(AccordionContext);
    if (!context) {
      throw new Error("AccordionTrigger must be used within an Accordion");
    }

    const parent = React.useContext(AccordionItemContext);
    if (!parent) {
      throw new Error("AccordionTrigger must be used within an AccordionItem");
    }

    const { value } = parent;
    const { openItems, toggleItem } = context;
    const isOpen = openItems.has(value);

    return (
      <button
        ref={ref}
        className={cn(
          "flex flex-1 items-center justify-between py-4 text-sm font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180",
          className
        )}
        onClick={() => toggleItem(value)}
        data-state={isOpen ? "open" : "closed"}
        {...props}
      >
        {children}
        <ChevronDownIcon className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200" />
      </button>
    );
  }
);
AccordionTrigger.displayName = "AccordionTrigger";

// Accordion Content
interface AccordionContentProps {
  className?: string;
  children: React.ReactNode;
}

const AccordionContent = React.forwardRef<HTMLDivElement, AccordionContentProps>(
  ({ className, children, ...props }, ref) => {
    const context = useContext(AccordionContext);
    if (!context) {
      throw new Error("AccordionContent must be used within an Accordion");
    }

    const parent = React.useContext(AccordionItemContext);
    if (!parent) {
      throw new Error("AccordionContent must be used within an AccordionItem");
    }

    const { value } = parent;
    const { openItems } = context;
    const isOpen = openItems.has(value);

    return (
      <div
        ref={ref}
        className={cn(
          "overflow-hidden text-sm",
          isOpen ? "animate-accordion-down" : "animate-accordion-up",
          className
        )}
        data-state={isOpen ? "open" : "closed"}
        {...props}
      >
        <div className="pb-4 pt-0">{children}</div>
      </div>
    );
  }
);
AccordionContent.displayName = "AccordionContent";

// Context for AccordionItem
const AccordionItemContext = createContext<{ value: string } | undefined>(undefined);

// Enhanced AccordionItem with context
const AccordionItemWithContext = React.forwardRef<HTMLDivElement, AccordionItemProps>(
  ({ value, className, children, ...props }, ref) => {
    return (
      <AccordionItemContext.Provider value={{ value }}>
        <AccordionItem ref={ref} value={value} className={className} {...props}>
          {children}
        </AccordionItem>
      </AccordionItemContext.Provider>
    );
  }
);
AccordionItemWithContext.displayName = "AccordionItem";

export {
  Accordion, AccordionContent, AccordionItemWithContext as AccordionItem,
  AccordionTrigger
};

