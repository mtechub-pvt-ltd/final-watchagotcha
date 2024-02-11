import moment from "moment";
import pool from "../db.config/index.js";
import { getAllRows, getSingleRow } from "../queries/common.js";
import { handle_delete_photos_from_folder } from "../utils/handleDeletePhoto.js";
export const createBanner = async (req, res) => {
  try {
    const { user_id,banner_link, price, startDate, endDate, status,paid_status,image } = req.body;
    const checkQuery1 =
    "SELECT * FROM users WHERE id = $1 AND is_deleted=FALSE";
    const checkResult1 = await pool.query(checkQuery1, [user_id]);

    if (checkResult1.rowCount === 0) {
      handle_delete_photos_from_folder([req.file?.filename], "bannerImages");
      return res
        .status(404)
        .json({ statusCode: 404, message: "user not exist" });
    }
    // if (req.file) {
      // let imagePath = `/bannerImages/${req.file.filename}`;
      const defaultStatus = status ? status.trim() : "inactive";
      const createQuery = `INSERT INTO banner (image,banner_link,price,startDate,endDate,status,user_id,paid_status) VALUES($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`;
      const result = await pool.query(createQuery, [
        // imagePath,
        image,
        banner_link,
        price,
        startDate,
        endDate,
        status || defaultStatus,
        user_id,
        paid_status
      ]);
      if (result.rowCount === 1) {
        const getQuery=`
        SELECT banner.*, users.username AS user_username, users.image AS user_image
        FROM banner
        LEFT JOIN users ON banner.user_id = users.id
        WHERE banner.id = $1
        
        `
        const banner=await pool.query(getQuery,[result.rows[0].id])
        return res.status(201).json({
          statusCode: 201,
          message: "Banner created successfully",
          data: {
            ...banner.rows[0],
            startdate: moment(banner.rows[0].startdate).format("YYYY-MM-DD"),
            enddate: moment(banner.rows[0].enddate).format("YYYY-MM-DD"),
          },
        });
      }
      res.status(400).json({ statusCode: 400, message: "Not created" });
    // } else {
    //   res.status(400).json({ statusCode: 400, message: "image not uploaded" });
    // }
  } catch (error) {
    console.error(error);
    handle_delete_photos_from_folder([req.file?.filename], "bannerImages");
    if(error.constraint==='check_status_type'){
      return res.status(400).json({ statusCode: 400, message: "Invalid status type" });
    }else if(error.constraint==='check_valid_banner_link'){
      return res.status(400).json({ statusCode: 400, message: "Invalid link format" });
    }else if(error.constraint==='check_valid_paid_status'){
      return res.status(400).json({ statusCode: 400, message: "Paid status must be boolean value" });
    }else if (error.constraint === "banner_user_id_fkey") {
      return res
        .status(400)
        .json({ statusCode: 400, message: "user id not exist" });
    }
    
    res.status(500).json({ statusCode: 500, message: "Internal server error",error });
  }
};

export const deletebanner = async (req, res) => {
  const { id } = req.params;
  try {
    const condition = {
      column: "id",
      value: id,
    };
    const oldImage = await getSingleRow("banner", condition);
    if (oldImage.length === 0) {
      return res
        .status(404)
        .json({ statusCode: 404, message: "Banner not found " });
    }
    const oldImageSplit = oldImage[0].image.replace("/bannerImages/", "");
    const delQuery = "DELETE FROM banner WHERE id=$1";
    const result = await pool.query(delQuery, [id]);
    if (result.rowCount === 0) {
      return res
        .status(404)
        .json({ statusCode: 404, message: "Banner not deleted" });
    }
    handle_delete_photos_from_folder([oldImageSplit], "bannerImages");
    res
      .status(200)
      .json({
        statusCode: 200,
        message: "Banner deleted successfully",
        deletedBanner: oldImage[0],
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ statusCode: 500, message: "Internal server error" });
  }
};

export const getSpecificBanner = async (req, res) => {
  try {
    const { id } = req.params;
    const getQuery=`
    SELECT banner.*, users.username AS user_username, users.image AS user_image
    FROM banner
    LEFT JOIN users ON banner.user_id = users.id
    WHERE banner.id = $1 AND users.is_deleted=FALSE
    
    `
    const banner=await pool.query(getQuery,[id])
    if (banner.rows.length > 0) {
      return res.status(200).json({ statusCode: 200, banner: {
        ...banner.rows[0],
        startdate: moment(banner.rows[0].startdate).format("YYYY-MM-DD"),
        enddate: moment(banner.rows[0].enddate).format("YYYY-MM-DD"),
      }, });
    } else {
      res.status(200).json({ statusCode: 200, banner:[] });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const getAllBanners = async (req, res) => {
  try {
    let page = parseInt(req.query.page || 1); // Get the page number from the query parameters
    const perPage = parseInt(req.query.limit || 5);
    const offset = (page - 1) * perPage;
    let blogQuery=`
    SELECT banner.*, users.username AS user_username, users.image AS user_image
    FROM banner
    LEFT JOIN users ON banner.user_id = users.id
    WHERE users.is_deleted = FALSE
    ORDER BY created_at DESC
    
    `
    if (req.query.page === undefined && req.query.limit === undefined) {
      // If no query parameters for pagination are provided, fetch all categories without pagination
      blogQuery = ` SELECT banner.*, users.username AS user_username, users.image AS user_image
      FROM banner
      LEFT JOIN users ON banner.user_id = users.id
      WHERE users.is_deleted = FALSE
      ORDER BY created_at DESC`;
    } else {
      blogQuery += ` LIMIT $1 OFFSET $2;`;
    }
    let queryParameters = [];

    if (req.query.page !== undefined || req.query.limit !== undefined) {
      queryParameters = [perPage, offset];
    }

    const { rows } = await pool.query(blogQuery, queryParameters);
    const formattedBanners = rows?.map((banner) => ({
        ...banner,
        startdate: moment(banner.startdate).format("YYYY-MM-DD"),
        enddate: moment(banner.enddate).format("YYYY-MM-DD"),
      }));
    if (req.query.page === undefined && req.query.limit === undefined) {
      // If no pagination is applied, don't calculate totalCategories and totalPages
      res.status(200).json({
        statusCode: 200,
        totalBanners: rows.length,
        AllBanners: formattedBanners,
      });
    } else {
      // Calculate the total number of categories (without pagination)
      const totalBannersQuery = `SELECT COUNT(*) AS total FROM public.banner`;
      const totalBannersResult = await pool.query(totalBannersQuery);
      const totalBanners = totalBannersResult.rows[0].total;
      const totalPages = Math.ceil(totalBanners / perPage);

      res.status(200).json({
        statusCode: 200,
        totalBanners,
        totalPages,
        AllBanners: formattedBanners,
      });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ statusCode: 500, message: "Internal server error", error });
  }
};

export const updateBanner = async (req, res) => {``
  try {
    const { id, banner_link, price, startDate, endDate, status,paid_status,image } = req.body;

    if (!id) {
      return res.status(400).json({
        statusCode: 400,
        message: "Missing banner ID in the request body",
      });
    }

    const existingBanner = await pool.query(
      "SELECT * FROM banner WHERE id = $1",
      [id]
    );

    if (existingBanner.rows.length === 0) {
      return res.status(404).json({
        statusCode: 404,
        message: "Banner with the provided ID not found",
      });
    }
    let updateData = {
      image: existingBanner.rows[0].image,
    };
    if (image) {
      updateData.image = image;
      const imageSplit = existingBanner.rows[0].image.replace(
        "/fileUpload/",
        ""
      );
      handle_delete_photos_from_folder([imageSplit], "fileUpload");
    }
    // if (req.file && req.file.filename) {
    //   updateData.image = `/bannerImages/${req.file.filename}`;
    //   const imageSplit = existingBanner.rows[0].image.replace(
    //     "/bannerImages/",
    //     ""
    //   );
    //   handle_delete_photos_from_folder([imageSplit], "bannerImages");
    // }
    // If status is not provided in the request, use the existing status
    const updatedStatus = status
      ? status.trim()
      : existingBanner.rows[0].status;

    const updateQuery = `
        UPDATE banner
        SET banner_link = $2, price = $3, startDate = $4, endDate = $5, status = $6,image=$7,paid_status=$8
        WHERE id = $1
        RETURNING *`;

    const result = await pool.query(updateQuery, [
      id,
      banner_link,
      price,
      startDate,
      endDate,
      updatedStatus,
      updateData.image,
      paid_status
    ]);

    if (result.rowCount === 1) {
        const getQuery=`
        SELECT banner.*, users.username AS user_username, users.image AS user_image
        FROM banner
        LEFT JOIN users ON banner.user_id = users.id
        WHERE banner.id = $1
        
        `
        const banner=await pool.query(getQuery,[id])
      return res.status(200).json({
        statusCode: 200,
        message: "Banner updated successfully",
        data: {
            ...banner.rows[0],
            startdate: moment(banner.rows[0].startdate).format("YYYY-MM-DD"),
            enddate: moment(banner.rows[0].enddate).format("YYYY-MM-DD"),
          },
      });
    }

    res.status(400).json({ statusCode: 400, message: "Update failed" });
  } catch (error) {
    handle_delete_photos_from_folder([req.file?.filename], "bannerImages");
    if(error.constraint==='check_status_type'){
      return res.status(400).json({ statusCode: 400, message: "Invalid status type" });
    }else if(error.constraint==='check_valid_banner_link'){
      return res.status(400).json({ statusCode: 400, message: "Invalid link format" });
    }else if(error.constraint==='check_valid_paid_status'){
      return res.status(400).json({ statusCode: 400, message: "Paid status must be boolean value" });
    }
    console.error(error);
    res.status(500).json({ statusCode: 500, message: "Internal server error" });
  }
};

export const deleteAllBanner = async (req, res) => {
  try {
    // Perform a query to delete all users from the database
    const query = "DELETE FROM banner RETURNING *";
    const { rows } = await pool.query(query);

    if (rows.length === 0) {
      return res.status(404).json({
        statusCode: 404,
        message: "No blog found to delete",
      });
    }
    const imageFilenames = rows.map((banner) =>
    banner.image.replace("/bannerImages/", "")
  );
  handle_delete_photos_from_folder(imageFilenames, "bannerImages");
    res.status(200).json({
      statusCode: 200,
      message: "All banner deleted successfully",
      deletedBanner: rows,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ statusCode: 500, message: "Internal server error" });
  }
};
export const searchBanner = async (req, res) => {
    try {
      const { searchWord } = req.query;
  
      // Split the search query into individual words
      const searchWords = searchWord.split(/\s+/).filter(Boolean);
  
      if (searchWords.length === 0) {
        return res.status(200).json({ statusCode: 200, Banners: [] });
      }
  
      // Create an array of conditions for each search word
      const conditions = searchWords.map((word) => {
        return `(banner_link ILIKE '%${word}%' OR price::TEXT ILIKE '%${word}%')`;
      });
      let searchQuery=`
      SELECT banner.*, users.username AS user_username, users.image AS user_image
      FROM banner
      LEFT JOIN users ON banner.user_id = users.id
      WHERE ${conditions.join(" OR ")}
      ORDER BY created_at DESC
      
      `
  
      const { rows } = await pool.query(searchQuery);
  
      return res.status(200).json({ statusCode: 200, totalResults: rows.length, Banners: rows });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  
  export const getAllBannersByUser = async (req, res) => {
    try {
        const {id}=req.params
      let page = parseInt(req.query.page || 1); // Get the page number from the query parameters
      const perPage = parseInt(req.query.limit || 5);
      const offset = (page - 1) * perPage;
      let blogQuery=`
      SELECT banner.*, users.username AS user_username, users.image AS user_image
      FROM banner
      LEFT JOIN users ON banner.user_id = users.id
      WHERE banner.user_id=$1 AND users.is_deleted = FALSE
      ORDER BY created_at DESC
      
      `
      if (req.query.page === undefined && req.query.limit === undefined) {
        // If no query parameters for pagination are provided, fetch all categories without pagination
        blogQuery = ` SELECT banner.*, users.username AS user_username, users.image AS user_image
        FROM banner
        LEFT JOIN users ON banner.user_id = users.id
        WHERE banner.user_id=$1 AND users.is_deleted = FALSE
        ORDER BY created_at DESC`;
      } else {
        blogQuery += ` LIMIT $2 OFFSET $3;`;
      }
      let queryParameters = [id];
  
      if (req.query.page !== undefined || req.query.limit !== undefined) {
        queryParameters = [id,perPage, offset];
      }
  
      const { rows } = await pool.query(blogQuery, queryParameters);
      const formattedBanners = rows?.map((banner) => ({
          ...banner,
          startdate: moment(banner.startdate).format("YYYY-MM-DD"),
          enddate: moment(banner.enddate).format("YYYY-MM-DD"),
        }));
      if (req.query.page === undefined && req.query.limit === undefined) {
        // If no pagination is applied, don't calculate totalCategories and totalPages
        res.status(200).json({
          statusCode: 200,
          totalBanners: rows.length,
          AllBanners: formattedBanners,
        });
      } else {
        // Calculate the total number of categories (without pagination)
        const totalBannersQuery = `SELECT COUNT(*) AS total FROM public.banner 
        LEFT JOIN users ON banner.user_id = users.id
        WHERE user_id=$1 AND users.is_deleted = FALSE
        `;
        const totalBannersResult = await pool.query(totalBannersQuery,[id]);
        const totalBanners = totalBannersResult.rows[0].total;
        const totalPages = Math.ceil(totalBanners / perPage);
  
        res.status(200).json({
          statusCode: 200,
          totalBanners,
          totalPages,
          AllBanners: formattedBanners,
        });
      }
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ statusCode: 500, message: "Internal server error", error });
    }
  };
  export const getAllBannersByStatus = async (req, res) => {
    try {
        const {status}=req.query
      let page = parseInt(req.query.page || 1); // Get the page number from the query parameters
      const perPage = parseInt(req.query.limit || 5);
      const offset = (page - 1) * perPage;
      let blogQuery=`
      SELECT banner.*, users.username AS user_username, users.image AS user_image
      FROM banner
      LEFT JOIN users ON banner.user_id = users.id
      WHERE banner.status=$1 AND users.is_deleted = FALSE
      ORDER BY created_at DESC
      
      `
      if (req.query.page === undefined && req.query.limit === undefined) {
        // If no query parameters for pagination are provided, fetch all categories without pagination
        blogQuery = ` SELECT banner.*, users.username AS user_username, users.image AS user_image
        FROM banner
        LEFT JOIN users ON banner.user_id = users.id
        WHERE banner.status=$1 AND users.is_deleted = FALSE
        ORDER BY created_at DESC`;
      } else {
        blogQuery += ` LIMIT $2 OFFSET $3;`;
      }
      let queryParameters = [status];
  
      if (req.query.page !== undefined || req.query.limit !== undefined) {
        queryParameters = [status,perPage, offset];
      }
  
      const { rows } = await pool.query(blogQuery, queryParameters);
      const formattedBanners = rows?.map((banner) => ({
          ...banner,
          startdate: moment(banner.startdate).format("YYYY-MM-DD"),
          enddate: moment(banner.enddate).format("YYYY-MM-DD"),
        }));
      if (req.query.page === undefined && req.query.limit === undefined) {
        // If no pagination is applied, don't calculate totalCategories and totalPages
        res.status(200).json({
          statusCode: 200,
          totalBanners: rows.length,
          AllBanners: formattedBanners,
        });
      } else {
        // Calculate the total number of categories (without pagination)
        const totalBannersQuery = `SELECT COUNT(*) AS total FROM public.banner
        LEFT JOIN users ON banner.user_id = users.id
        WHERE banner.status=$1 AND users.is_deleted = FALSE`;
        const totalBannersResult = await pool.query(totalBannersQuery,[status]);
        const totalBanners = totalBannersResult.rows[0].total;
        const totalPages = Math.ceil(totalBanners / perPage);
  
        res.status(200).json({
          statusCode: 200,
          totalBanners,
          totalPages,
          AllBanners: formattedBanners,
        });
      }
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ statusCode: 500, message: "Internal server error", error });
    }
  };

  export const updateBannerStatus = async (req, res) => {
    try {
      const { banner_id, status } = req.body;
  
      if (!banner_id) {
        return res.status(400).json({
          statusCode: 400,
          message: "Missing banner ID in the request body",
        });
      }
  
      const existingBanner = await pool.query(
        "SELECT * FROM banner WHERE id = $1",
        [banner_id]
      );
  
      if (existingBanner.rows.length === 0) {
        return res.status(404).json({
          statusCode: 404,
          message: "Banner with the provided ID not found",
        });
      }
      // if(existingBanner.rows.paid_status===false){
      //   return res.status(400).json({
      //     statusCode: 400,
      //     message: "Paid status of this banner is false.You cannot update status of this banner",
      //   });
      // }
      const updateQuery = `
          UPDATE banner
          SET  status = $1
          WHERE id = $2
          RETURNING *`;
  
      const result = await pool.query(updateQuery, [
        status,
        banner_id,
      ]);
  
      if (result.rowCount === 1) {
          const getQuery=`
          SELECT banner.*, users.username AS user_username, users.image AS user_image
          FROM banner
          LEFT JOIN users ON banner.user_id = users.id
          WHERE banner.id = $1
          
          `
          const banner=await pool.query(getQuery,[banner_id])
        return res.status(200).json({
          statusCode: 200,
          message: "Banner status updated successfully",
          data: {
              ...banner.rows[0],
              startdate: moment(banner.rows[0].startdate).format("YYYY-MM-DD"),
              enddate: moment(banner.rows[0].enddate).format("YYYY-MM-DD"),
            },
        });
      }
  
      res.status(400).json({ statusCode: 400, message: "Update failed" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ statusCode: 500, message: "Internal server error" });
    }
  };