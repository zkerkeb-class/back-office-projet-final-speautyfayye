import { API_CRUD, API_ROUTES } from '@/utils/constants';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export interface Category {
  id: number;
  name: string;
}

interface SelectedCategoryState {
  category: Category | null;
  categories: Category[] | null;
  loading: boolean;
  error: string | null;
}

// État initial
const initialState: SelectedCategoryState = {
  category: null,
  categories: null,
  loading: true,
  error: null,
};

// Thunk pour récupérer une catégorie depuis une API
export const fetchCategory = createAsyncThunk(
  'selectedCategory/fetchCategory',
  async (categoryId: string, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_URL_API}${API_ROUTES.CATEGORY}   ${categoryId}`,
      );
      if (!response.ok) {
        throw new Error('Failed to fetch category');
      }
      const data = await response.json();
      return data.data as Category;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);
export const fetchAllCategories = createAsyncThunk(
  'selectedCategory/fetchAllCategoriesSimulated',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const categoryIds = [1, 2, 3, 4, 5, 6, 7]; // Example category IDs
      const categories = await Promise.all(
        categoryIds.map(async (id) => {
          const result = await dispatch(fetchCategory(id.toString()));
          if (fetchCategory.fulfilled.match(result)) {
            return result.payload;
          } else {
            throw new Error('Failed to fetch category');
          }
        }),
      );
      return categories as Category[];
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);
// export const fetchAllCategories = createAsyncThunk(
//   'selectedCategory/fetchAllCategories',
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}${API_ROUTES.CATEGORY}`);
//       if (!response.ok) {
//         throw new Error('Failed to fetch categories');
//       }
//       const data = await response.json();
//       return data.data as Category[];
//     } catch (error) {
//       return rejectWithValue(error);
//     }
//   },
// );

export const createCategory = createAsyncThunk(
  'selectedCategory/createCategory',
  async (newCategory: Category, { rejectWithValue }) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}${API_ROUTES.CATEGORY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCategory),
      });
      if (!response.ok) {
        throw new Error('Failed to create category');
      }
      const data = await response.json();
      return data.data as Category;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const deleteCategory = createAsyncThunk(
  'selectedCategory/deleteCategory',
  async (categoryId: number, { rejectWithValue }) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}${API_ROUTES.CATEGORY}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete category');
      }
      return categoryId;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const updateCategory = createAsyncThunk(
  'selectedCategory/updateCategory',
  async (category: Category, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_URL_API}${API_CRUD.UPDATE}${API_ROUTES.CATEGORY}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(category),
        },
      );
      if (!response.ok) {
        throw new Error('Failed to update category');
      }
      const data = await response.json();
      return data.data as Category;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

const selectedCategorySlice = createSlice({
  name: 'selectedCategory',
  initialState,
  reducers: {
    clearSelectedCategory(state) {
      state.category = null;
      state.categories = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategory.fulfilled, (state, action) => {
        state.category = action.payload;
        state.loading = false;
      })
      .addCase(fetchCategory.rejected, (state) => {
        state.loading = false;
        state.error = 'Failed to fetch category';
      })
      .addCase(fetchAllCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
        state.loading = false;
      })
      .addCase(fetchAllCategories.rejected, (state) => {
        state.loading = false;
        state.error = 'Failed to fetch categories';
      })
      .addCase(deleteCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.categories = state.categories
          ? state.categories.filter((category: Category) => category.id !== action.payload)
          : null;
        state.loading = false;
      })
      .addCase(deleteCategory.rejected, (state) => {
        state.loading = false;
        state.error = 'Failed to delete category';
      })
      .addCase(createCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.categories = state.categories
          ? [...state.categories, action.payload]
          : [action.payload];
        state.loading = false;
      })
      .addCase(createCategory.rejected, (state) => {
        state.loading = false;
        state.error = 'Failed to create category';
      })
      .addCase(updateCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.categories = state.categories
          ? state.categories.map((category: Category) =>
              category.id === action.payload.id ? action.payload : category,
            )
          : null;
        state.loading = false;
      })
      .addCase(updateCategory.rejected, (state) => {
        state.loading = false;
        state.error = 'Failed to update category';
      });
  },
});

export default selectedCategorySlice.reducer;

export const { clearSelectedCategory } = selectedCategorySlice.actions;
