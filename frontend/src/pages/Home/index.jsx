import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  MenuItem,
  Button,
  Container,
  FormControl,
  Grid,
  InputLabel,
  Select,
  TextField,
} from "@mui/material";
import { setArticles } from "../../features/auth/authSlice";
import ArticleCard from "../../components/ArticleCard";
import { debounce } from "../../utils";
import { Link } from "react-router-dom";

const Home = () => {
  const { articles } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("desc");

  const fetchArticles = async () => {
    try {
      const response = await fetch(
        `/api/article/search?q=${searchQuery}&sortBy=${sortBy}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );
      const data = await response.json();
      dispatch(setArticles(data.data));
    } catch (error) {
      console.error("Error fetching articles:", error);
    }
  };

  const debouncedFetchArticles = useCallback(debounce(fetchArticles, 500), [
    searchQuery,
    sortBy,
  ]);

  useEffect(() => {
    debouncedFetchArticles();
  }, [debouncedFetchArticles]);

  const handleSearch = (e) => {
    const { value } = e.target;
    setSearchQuery(value);
  };

  const handleChangeSort = (event) => {
    setSortBy(event.target.value);
  };

  return (
    <Container sx={{ mt: "30px" }}>
      <Grid container spacing={2}>
        <Grid item xs={8}>
          <TextField
            label="Search Articles"
            variant="outlined"
            fullWidth
            value={searchQuery}
            onChange={handleSearch}
            style={{ marginBottom: "1rem" }}
          />
        </Grid>
        <Grid item xs={4}>
          <FormControl fullWidth>
            <InputLabel>Sort By</InputLabel>
            <Select
              name="Sort"
              label="Sort By"
              value={sortBy}
              onChange={handleChangeSort}
            >
              <MenuItem value="asc">Asc</MenuItem>
              <MenuItem value="desc">Des</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        {articles.length > 0 ? (
          articles?.map((article) => (
            <Grid item xs={12} sm={6} md={4} lg={4} key={article?._id}>
              <ArticleCard {...article} />
            </Grid>
          ))
        ) : (
          <div className="no-data-found">
            <img src="./src/assets/no-data.jpg" alt="No data found" />
            <h3>No data found!</h3>
            <Link to="/add"> Add Article</Link>
          </div>
        )}
      </Grid>
    </Container>
  );
};

export default Home;
