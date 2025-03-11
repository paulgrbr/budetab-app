import "./ProductItem.css";

import React from "react";

import arrowRight from "/icons/arrow-right.svg";

type ProductItemProps = {
  title: string;
  subtitle: string;
  amount: number;
  price: number;
  image: string;
  onClick: () => void;
};

const ProductItem: React.FC<ProductItemProps> = ({
  title,
  subtitle,
  amount,
  price,
  image,
  onClick,
}) => {
  return (
    <div
      onClick={() => {
        onClick();
      }}
      className="product-item-container"
    >
      <div className="product-item-image-container">
        <img src={image} />
        <span className="product-item-image-background"></span>
      </div>
      <div>
        <span className="product-item-title">
          <p id="title">{title}</p>
          <p className="product-item-amount">{amount + "x"}</p>
        </span>
        <p className="product-item-subtitle">{subtitle}</p>
      </div>
      <div className="product-item-right-group">
        <p>{"€ " + price.toFixed(2).replace(".", ",")}</p>
        <img src={arrowRight} />
      </div>
    </div>
  );
};

export default ProductItem;
