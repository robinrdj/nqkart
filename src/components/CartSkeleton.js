import { Box, Skeleton } from "@mui/material";
import React from "react";
import "./Cart.css";
import "./CartSkeleton.css";

/**
 * Placeholder that mirrors the row layout of <Cart /> — thumbnail, name,
 * quantity stepper and price — so the panel does not resize once the real
 * cart arrives.
 *
 * @param { Number } rows
 *    How many placeholder cart rows to draw
 * @param { Boolean } isReadOnly
 *    Matches the Cart prop: hides the checkout button placeholder
 */
const CartSkeleton = ({ rows = 2, isReadOnly = false }) => {
  return (
    <Box className="cart" aria-busy="true" aria-label="Loading your cart">
      {Array.from({ length: rows }).map((_, index) => (
        <Box
          key={`cart-skeleton-${index}`}
          display="flex"
          alignItems="flex-start"
          padding="1rem"
        >
          <Box className="image-container cart-skeleton-image">
            <Skeleton
              variant="rectangular"
              animation="wave"
              width="100%"
              height="100%"
            />
          </Box>
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
            height="6rem"
            paddingX="1rem"
            flex="1 1 auto"
            minWidth={0}
          >
            <Box>
              <Skeleton variant="text" animation="wave" width="70%" height={20} />
              <Skeleton variant="text" animation="wave" width="45%" height={20} />
            </Box>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Skeleton
                variant="rounded"
                animation="wave"
                width={isReadOnly ? 56 : 104}
                height={32}
              />
              <Skeleton variant="text" animation="wave" width={64} height={28} />
            </Box>
          </Box>
        </Box>
      ))}

      <Box
        padding="1rem"
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <Skeleton variant="text" animation="wave" width={90} height={24} />
        <Skeleton variant="text" animation="wave" width={110} height={40} />
      </Box>

      {!isReadOnly && (
        <Box display="flex" justifyContent="flex-end" className="cart-footer">
          <Skeleton
            variant="rounded"
            animation="wave"
            width={150}
            height={42}
          />
        </Box>
      )}
    </Box>
  );
};

export default CartSkeleton;
