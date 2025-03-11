import "./ProductItem.css";

import React from "react";

import { Skeleton, SkeletonText } from "@/components/ui/skeleton";

type ProductItemSkeletonProps = {
  fadeOut: boolean;
};

const ProductItemSkeleton: React.FC<ProductItemSkeletonProps> = ({
  fadeOut,
}) => {
  return (
    <div
      className={`product-item-container ${
        fadeOut ? "product-item-fade-out" : ""
      }`}
    >
      <Skeleton
        height="48px"
        width="48px"
        margin="5px"
        borderRadius="10px"
        variant="shine"
      />
      <SkeletonText noOfLines={2} marginRight="40px" variant="shine" />
    </div>
  );
};

export default ProductItemSkeleton;
