import React from "react";
import { Grid } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import { LineChart } from "@mui/x-charts/LineChart";
import { PieChart } from "@mui/x-charts/PieChart";

const Home = () => {
  return (
    <Grid
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexWrap: "wrap",
        rowGap: 1,
        columnGap: 5,
      }}
    >
      <div>
        <PieChart
          series={[
            {
              data: [
                { id: 0, value: 30, label: "Women Clothes" },
                { id: 1, value: 20, label: "Men Clothes" },
                { id: 2, value: 15, label: "Kids Clothes" },
                { id: 3, value: 20, label: "Baby Clothes" },
                { id: 4, value: 15, label: "Sales" },
              ],
            },
          ]}
          width={500}
          height={200}
        />
      </div>
      <div>
        <LineChart
          xAxis={[{ data: [1, 2, 3, 5, 8, 10] }]}
          series={[
            {
              data: [2, 5.5, 2, 8.5, 1.5, 5],
            },
          ]}
          width={500}
          height={300}
        />
      </div>
      <div>
        <BarChart
          xAxis={[
            {
              scaleType: "band",
              data: [
                "Women Clothes",
                "Men Clothes",
                "Kids Clothes",
                "Baby Clothes",
                "Sales",
              ],
            },
          ]}
          series={[
            { data: [4, 3, 5, 6, 4] },
            { data: [1, 6, 3, 5, 1] },
            { data: [2, 5, 6, 2, 6] },
            { data: [2, 4, 7, 5, 1] },
            { data: [3, 5, 4, 3, 6] },
          ]}
          width={800}
          height={300}
        />
      </div>
    </Grid>
  );
};

export default Home;
