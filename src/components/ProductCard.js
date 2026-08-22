import { AddShoppingCartOutlined } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Rating,
  Typography,
} from "@mui/material";
import React from "react";
import "./ProductCard.css";

const ProductCard = ({ product, handleAddToCart }) => {
  return (
    <Card className="card" elevation={0}>
      <Box className="card-media-wrap">
        <CardMedia
          component="img"
          image={product.image}
          alt={product.name}
          className="card-media"
        />
      </Box>

      <CardContent className="card-content">
        <Typography className="card-name" title={product.name}>
          {product.name}
        </Typography>

        <Box className="card-meta">
          <Typography className="card-cost">${product.cost}</Typography>
          <Box className="card-rating">
            <Rating
              name="read-only"
              value={product.rating}
              precision={0.5}
              size="small"
              readOnly
            />
            <span className="card-rating-value">{product.rating}</span>
          </Box>
        </Box>
      </CardContent>

      <CardActions className="card-actions" disableSpacing>
        <Button
          className="card-button"
          fullWidth
          variant="contained"
          disableElevation
          onClick={() => handleAddToCart(product._id)}
          startIcon={<AddShoppingCartOutlined />}
        >
          Add to cart
        </Button>
      </CardActions>
    </Card>
  );
};

export default ProductCard;
