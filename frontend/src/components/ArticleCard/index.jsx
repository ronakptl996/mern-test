import React from "react";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
} from "@mui/material";
import { capitalizeFirstLetter } from "../../utils";

const ArticleCard = ({
  data: { title, description, category, createdAt, createdBy },
}) => {
  console.log({ title });
  return (
    <Card
      sx={{ maxWidth: 345, m: 2, boxShadow: 3, "&:hover": { boxShadow: 6 } }}
    >
      <CardContent>
        <Typography variant="h5" component="div" gutterBottom>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Category: {capitalizeFirstLetter(category)}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description.length > 200
            ? `${description.substring(0, 200)}...`
            : description}
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Created by: {createdBy?.username}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {createdAt}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ArticleCard;
