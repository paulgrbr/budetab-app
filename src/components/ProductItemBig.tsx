import "./ProductItemBig.css";

import { Badge, Box, Float, Tag } from "@chakra-ui/react";
import React from "react";

type ProductItemBigProps = {
  title: string;
  subtitle: string;
  price: number;
  image: string;
  amount: number;
  onClick: () => void;
};

const ProductItem: React.FC<ProductItemBigProps> = ({
  title,
  subtitle,
  price,
  image,
  amount,
  onClick,
}) => {
  const createRipple = (event: React.MouseEvent<HTMLDivElement>) => {
    const target = event.currentTarget;
    const rect = target.getBoundingClientRect();
    const circle = document.createElement("span");
    const diameter = Math.max(target.clientWidth, target.clientHeight);
    const radius = diameter / 2;
    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${event.clientX - rect.left - radius}px`;
    circle.style.top = `${event.clientY - rect.top - radius}px`;
    circle.classList.add("ripple");

    // Remove any existing ripple element
    const existingRipple = target.getElementsByClassName("ripple")[0];
    if (existingRipple) {
      existingRipple.remove();
    }
    target.appendChild(circle);
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    createRipple(e);
    onClick();
  };

  return (
    <Box
      position="relative"
      className={`product-item-big-container ${
        amount > 0 ? "product-item-big-selected" : ""
      }`}
    >
      <div onClick={handleClick} className="product-item-big-inner-container">
        <div className="product-item-big-image-container">
          <img src={image} alt={title} />
          <span className="product-item-big-image-background"></span>
        </div>
        <p className="product-item-big-title">{title}</p>
        <span className="product-item-big-subtitle">
          <Badge colorPalette="purple">{subtitle}</Badge>
          <Badge colorPalette="yellow">
            {"€ " + price.toFixed(2).replace(".", ",")}
          </Badge>
        </span>
      </div>
      {amount > 0 && (
        <Float
          placement="top-start"
          offsetY="3"
          offsetX="5"
          className="product-item-big-item-tag"
        >
          <Tag.Root
            variant="solid"
            size="xl"
            backgroundColor="#7900FF"
            color="#FFFFFF"
            rounded="full"
          >
            <Tag.Label>
              <b>{amount + "x"}</b>
            </Tag.Label>
            <Tag.EndElement>
              <Tag.CloseTrigger />
            </Tag.EndElement>
          </Tag.Root>
        </Float>
      )}
    </Box>
  );
};

export default ProductItem;
