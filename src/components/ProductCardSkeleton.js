import { Box, Card, Skeleton } from "@mui/material";
import React from "react";
import "./ProductCard.css";

/**
 * Placeholder that mirrors the layout of <ProductCard /> so the grid does not
 * reflow once the real products arrive.
 */
const ProductCardSkeleton = () => {
  return (
    <Card className="card" elevation={0}>
      <Box className="card-media-wrap">
        <Skeleton
          variant="rectangular"
          animation="wave"
          className="card-media-skeleton"
        />
      </Box>

      <Box className="card-content card-skeleton-content">
        <Skeleton variant="text" animation="wave" width="90%" height={18} />
        <Skeleton variant="text" animation="wave" width="65%" height={18} />

        <Box className="card-meta">
          <Skeleton variant="text" animation="wave" width={60} height={28} />
          <Skeleton variant="text" animation="wave" width={80} height={20} />
        </Box>
      </Box>

      <Box className="card-actions card-skeleton-actions">
        <Skeleton
          variant="rectangular"
          animation="wave"
          height={38}
          className="card-button-skeleton"
        />
      </Box>
    </Card>
  );
};

export default ProductCardSkeleton;
