import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Container, Grid } from "@mui/material";
import ArticleCard from "../../components/ArticleCard";
import { fetchAllArticles } from "../../features/auth/authSlice";

const Home = () => {
  const dispatch = useDispatch();

  const { articles } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchAllArticles());
  }, [dispatch]);

  return (
    <Container>
      <Grid container spacing={2}>
        {articles.map((article) => (
          <Grid item xs={12} sm={6} md={4} lg={4} key={article._id}>
            <ArticleCard {...article} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Home;
