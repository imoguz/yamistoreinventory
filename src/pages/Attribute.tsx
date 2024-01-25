import React from "react";
import { Paper, Typography } from "@mui/material";

const Attribute = () => {
  return (
    <Paper elevation={3} style={{ padding: 16 }}>
      <Typography variant="h5" gutterBottom>
        Product Attribute:
      </Typography>

      <Typography variant="subtitle1" gutterBottom>
        On the Product Attribute page, you can manage various attributes that
        define the characteristics of your products. Each attribute corresponds
        to a specific aspect of your products, such as color, size, variant,
        category, discount, and promotion.
      </Typography>
      <Typography variant="h6" gutterBottom>
        Key Features:
      </Typography>
      <Typography variant="subtitle1" gutterBottom></Typography>
      <Typography variant="subtitle1" gutterBottom>
        1. Color: Manage the color options available for your products.
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        2. Size: Define different sizes for your products.
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        3. Variant: Handle product variants to provide more options for your
        customers.
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        4. Category: Categorize your products into different groups for easy
        navigation.
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        5. Discount: Set up discount options for selected products.
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        6. Promotion: Manage promotional activities and special offers for your
        products.
      </Typography>
      <Typography variant="h6" gutterBottom>
        Usage:
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        - Click on each attribute button in the AppBar to view and manage the
        corresponding data in the DataGrid.
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        - Utilize the DataGrid for easy and efficient addition, deletion,
        updating, and listing of attribute-related information.
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Note: Make sure to save your changes after making any modifications to
        ensure the accurate representation of your product attributes. Explore
        the flexibility and power of the Product Attribute page to enhance the
        organization and presentation of your product catalog.
      </Typography>
    </Paper>
  );
};

export default Attribute;
