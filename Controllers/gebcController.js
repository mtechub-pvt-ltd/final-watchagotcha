import pool from "../db.config/index.js";
import { getAllRows, getSingleRow } from "../queries/common.js";
import { handle_delete_photos_from_folder } from "../utils/handleDeletePhoto.js";
export const createGEBC = async (req, res) => {
  try {
    const {  description, disc_category, user_id,image } = req.body;
   
    // if (req.file) {
      // let imagePath = `/gebcImages/${image}`;
      const createQuery =
        "INSERT INTO GEBC (description,disc_category,image,user_id) VALUES($1,$2,$3,$4) RETURNING *";
      const result = await pool.query(createQuery, [
        description,
        disc_category,
        // imagePath,
        image,
        user_id,
      ]);
      if (result.rowCount === 1) {
        const query = `SELECT
        v.id AS GEBC_id,
        v.description,
        v.disc_category,
        v.image,
        v.created_at AS tour_created_at,
        v.user_id,
        u.username AS username,
        u.image AS userImage
        
    FROM GEBC v
    JOIN users u ON v.user_id = u.id
    WHERE v.id = $1
    GROUP BY v.id, u.username, u.image;
     `;
     const data=await pool.query(query,[result.rows[0].id])
        return res.status(201).json({
          statusCode: 201,
          message: "GEBC posted successfully",
          data: data.rows[0],
        });
      }
      res.status(400).json({ statusCode: 400, message: "Not uploaded" });
    // } else {
    //   res.status(400).json({ statusCode: 400, message: "image not uploaded" });
    // }
  } catch (error) {
    console.error(error);
    if (error.constraint === 'gebc_disc_category_fkey') {
      res.status(400).json({ statusCode: 400, message: "Disc category does not exist" });
    } else if (error.constraint === 'gebc_user_id_fkey') {
      res.status(400).json({ statusCode: 400, message: " user does not exist" });
    } 
    res.status(500).json({ statusCode: 500, message: "Internal server error" });
  }
};

export const deleteGEBC = async (req, res) => {
  const { id } = req.params;
  try {
    const condition = {
      column: "id",
      value: id,
    };
    const oldImage = await getSingleRow("GEBC", condition);
    if (oldImage.length === 0) {
      return res
        .status(404)
        .json({ statusCode: 404, message: "GEBC not found " });
    }
    const oldImageSplit = oldImage[0].image.replace("/gebcImages/", "");
    const delQuery = "DELETE FROM GEBC WHERE id=$1";
    const result = await pool.query(delQuery, [id]);
    if (result.rowCount === 0) {
      return res
        .status(404)
        .json({ statusCode: 404, message: "GEBC not deleted" });
    }
    handle_delete_photos_from_folder([oldImageSplit], "gebcImages");
    res.status(200).json({
      statusCode: 200,
      message: "GEBC deleted successfully",
      deletedGEBC: oldImage[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ statusCode: 500, message: "Internal server error" });
  }
};
export const updateGEBC = async (req, res) => {
  try {
    const { id, description, disc_category,image } = req.body;
    const condition = {
      column: "id",
      value: id,
    };
    const oldImage = await getSingleRow("gebc", condition);
    console.log(oldImage);
    if (oldImage.length === 0) {
        // handle_delete_photos_from_folder([req.file?.filename], "gebcImages");
      return res
        .status(404)
        .json({ statusCode: 404, message: "GEBC not found " });
    }
    const checkQuery =
    "SELECT * FROM disc_category WHERE id = $1";
    const checkResult = await pool.query(checkQuery, [disc_category]);

    if (checkResult.rowCount === 0) {
        // handle_delete_photos_from_folder([req.file?.filename], "gebcImages");
      return res
        .status(404)
        .json({ statusCode: 404, message: "Disc category not exist" });
    }
    let updateData = {
      image: oldImage[0].image,
    };
    if (image) {
      updateData.image = image;
      const imageSplit = oldImage[0].image.replace("/fileUpload/", "");
      handle_delete_photos_from_folder([imageSplit], "fileUpload");
    }

    const updateType = `UPDATE GEBC SET description=$1,disc_category=$2,image=$3,"updated_at"=NOW() WHERE id=$4 RETURNING *`;
    const result = await pool.query(updateType, [
      description,
      disc_category,
      updateData.image,
      id,
    ]);
    if (result.rowCount === 1) {
      const query = `SELECT
      v.id AS GEBC_id,
      v.description,
      v.disc_category,
      v.image,
      v.created_at AS tour_created_at,
      v.user_id,
      u.username AS username,
      u.image AS userImage
      
  FROM GEBC v
  JOIN users u ON v.user_id = u.id
  WHERE v.id = $1
  GROUP BY v.id, u.username, u.image;
  
   
   `;
   const data=await pool.query(query,[id])
      return res
        .status(200)
        .json({
          statusCode: 200,
          message: "GEBC updated successfully",
          updateGEBC: data.rows[0],
        });
    } else {
      res
        .status(404)
        .json({ statusCode: 404, message: "Operation not successfull" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const deleteAllGEBCs= async (req, res) => {
  try {
    // Perform a query to delete all users from the database
    const query = "DELETE FROM GEBC RETURNING *";
    const { rows } = await pool.query(query);

    if (rows.length === 0) {
      return res.status(404).json({
        statusCode: 404,
        message: "No GEBC found to delete",
      });
    }
    const imageFilenames = rows.map((news) => news.image.replace("/gebcImages/", ""));
    handle_delete_photos_from_folder(imageFilenames, 'gebcImages');
    res.status(200).json({
      statusCode: 200,
      message: "All GEBC deleted successfully",
      deletedGEBC: rows,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ statusCode: 500, message: "Internal server error" });
  }
};
export const sendComment = async (req, res) => {
  try {
    const { GEBC_id, user_id, comment } = req.body;
    const checkQuery =
    "SELECT * FROM GEBC WHERE id = $1";
  const checkResult = await pool.query(checkQuery, [GEBC_id]);

  if (checkResult.rowCount === 0) {
    return res
      .status(404)
      .json({ statusCode: 404, message: "GEBC not exist" });
  }
  const checkQuery1 =
  "SELECT * FROM users WHERE id = $1";
const checkResult1 = await pool.query(checkQuery1, [user_id]);

if (checkResult1.rowCount === 0) {
  return res
    .status(404)
    .json({ statusCode: 404, message: "user not exist" });
}
  
    const createQuery =
      "INSERT INTO GEBC_comment (GEBC_id,user_id,comment) VALUES($1,$2,$3) RETURNING *";
    const result = await pool.query(createQuery, [
      GEBC_id,
      user_id,
      comment,
    ]);
    if (result.rowCount === 1) {
      let commentQuery = `SELECT 
      v.GEBC_id AS GEBC_id,
      v.id AS commentId,
            v.comment AS comment,
            u.id AS userId,
            u.username AS username,
            u.image AS userImage
            FROM GEBC_comment v
            LEFT JOIN users u ON v.user_id = u.id
            WHERE v.id=$1
            ORDER BY v.created_at DESC;
            `;
      const { rows } = await pool.query(commentQuery, [result.rows[0].id]);
      return res.status(201).json({
        statusCode: 201,
        message: "Comment posted successfully",
        data: rows[0],
      });
    }
    res.status(400).json({ statusCode: 400, message: "Not uploaded" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ statusCode: 500, message: "Internal server error" });
  }
};
export const getAllCommentsByGEBC = async (req, res) => {
  try {
    const { id } = req.params;
    const checkQuery =
    "SELECT * FROM GEBC WHERE id = $1";
  const checkResult = await pool.query(checkQuery, [id]);

  if (checkResult.rowCount === 0) {
    return res
      .status(404)
      .json({ statusCode: 404, message: "GEBC not exist" });
  }

    let commentQuery = `SELECT v.id AS commentId,
      v.comment AS comment,
      u.id AS userId,
      u.username AS username,
      u.image AS userImage
      FROM GEBC_comment v
      LEFT JOIN users u ON v.user_id = u.id
      WHERE GEBC_id=$1 AND u.is_deleted=FALSE
      ORDER BY v.created_at DESC;
      `;

    const { rows } = await pool.query(commentQuery, [id]);
    res.status(200).json({
      statusCode: 200,
      totalComments: rows.length,
      AllComents: rows,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ statusCode: 500, message: "Internal server error", error });
  }
};

export const likeUnlikeGEBC = async (req, res) => {
  try {
    const { GEBC_id, user_id } = req.body;
    const checkQafiQuery =
    "SELECT * FROM GEBC WHERE id = $1";
  const checkQafiResult = await pool.query(checkQafiQuery, [GEBC_id]);

  if (checkQafiResult.rowCount === 0) {
    return res
      .status(404)
      .json({ statusCode: 404, message: "GEBC not exist" });
  }

    // Check if the user has already liked the video
    const checkQuery =
      "SELECT * FROM like_GEBC WHERE GEBC_id = $1 AND user_id = $2";
    const checkResult = await pool.query(checkQuery, [GEBC_id, user_id]);

    if (checkResult.rowCount > 0) {
        const createQuery = "DELETE FROM like_GEBC WHERE user_id=$1 AND GEBC_id=$2 RETURNING *";
        const result = await pool.query(createQuery, [user_id,GEBC_id]);
        if (result.rowCount === 1) {
          return res.status(200).json({
            statusCode: 201,
            message: "GEBC Unlike successfully",
            data: result.rows[0],
          });
        }
    }
    const createQuery =
      "INSERT INTO like_GEBC (GEBC_id,user_id) VALUES($1,$2) RETURNING *";
    const result = await pool.query(createQuery, [GEBC_id, user_id]);
    if (result.rowCount === 1) {
      return res.status(201).json({
        statusCode: 201,
        message: "GEBC like successfully",
        data: result.rows[0],
      });
    }
    res.status(400).json({ statusCode: 400, message: "Not uploaded" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ statusCode: 500, message: "Internal server error" });
  }
};

export const UnlikePicTour = async (req, res) => {
  try {
    const { like_id } = req.body;
    const createQuery = "DELETE FROM like_pic WHERE id=$1 RETURNING *";
    const result = await pool.query(createQuery, [like_id]);
    if (result.rowCount === 1) {
      return res.status(200).json({
        statusCode: 201,
        message: "Pic tour Unlike successfully",
        data: result.rows[0],
      });
    }
    res.status(400).json({ statusCode: 400, message: "User like not exist" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ statusCode: 500, message: "Internal server error" });
  }
};
export const getAllLikesByGBEC= async (req, res) => {
    try {
      const { id } = req.params;
      let likeQuery = `SELECT v.*
        FROM like_GEBC v
        WHERE GEBC_id=$1
        ORDER BY v.created_at DESC;
        `;
  
      const { rows } = await pool.query(likeQuery, [id]);
      res.status(200).json({
        statusCode: 200,
        totalLikes: rows.length,
        AllLikes: rows,
      });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ statusCode: 500, message: "Internal server error", error });
    }
  };

export const getSpecificGEBC = async (req, res) => {
  try {
    const { id } = req.params;
    const query = `SELECT
    v.id AS GEBC_id,
    v.description,
    v.disc_category,
    v.image,
    v.created_at AS tour_created_at,
    v.user_id,
    u.username AS username,
    u.image AS userImage,
    (
        SELECT COALESCE(json_agg(
            json_build_object(
                'comment_id', c.id,
                'comment', c.comment,
                'user_id', c.user_id,
                'username', cu.username,
                'userimage', cu.image,
                'comment_created_at', c.created_at
            )
        ), '[]'::json)
        FROM GEBC_comment c
        JOIN users cu ON c.user_id = cu.id
        WHERE c.GEBC_id = v.id
    ) AS comments,
    (
        SELECT COALESCE(json_agg(
            json_build_object(
                'id', lv.id,
                'user_id', lv.user_id,
                'GEBC_id', v.id,
                'created_at', lu.created_at,
                'updated_at', lu.updated_at
            )
        ), '[]'::json)
        FROM like_GEBC lv
        JOIN users lu ON lv.user_id = lu.id
        WHERE lv.GEBC_id = v.id
    ) AS likes
FROM GEBC v
JOIN users u ON v.user_id = u.id
WHERE v.id = $1 AND u.is_deleted=FALSE
GROUP BY v.id, u.username, u.image;

 
 `;

    const { rows } = await pool.query(query, [id]);
    if (rows.length > 0) {
      return res.status(200).json({ statusCode: 200, GEBC: rows[0] });
    } else {
      res.status(404).json({ statusCode: 404, message: "No GEBC found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const getAllGEBCs = async (req, res) => {
  try {
    let page = parseInt(req.query.page); // Get the page number from the query parameters
    const perPage = parseInt(req.query.limit);
    const offset = (page - 1) * perPage;
    let getQuery = `SELECT
    v.id AS GEBC_id,
    v.description,
    v.disc_category,
    v.image,
    v.created_at AS tour_created_at,
    v.user_id,
    u.username AS username,
    u.image AS userImage
  
FROM GEBC v
JOIN users u ON v.user_id = u.id
WHERE u.is_deleted=FALSE
ORDER BY v.created_at DESC`;

    if (req.query.page === undefined && req.query.limit === undefined) {
    } else {
      getQuery += ` LIMIT $1 OFFSET $2;`;
    }
    let queryParameters = [];

    if (req.query.page !== undefined || req.query.limit !== undefined) {
      queryParameters = [perPage, offset];
    }

    const { rows } = await pool.query(getQuery, queryParameters);

    if (req.query.page === undefined && req.query.limit === undefined) {
      // If no pagination is applied, don't calculate totalCategories and totalPages
      res.status(200).json({
        statusCode: 200,
        totalGEBC: rows.length,
        AllQAFIs: rows,
      });
    } else {
      // Calculate the total number of categories (without pagination)
      const countQuery = `SELECT COUNT(*) FROM GEBC JOIN users u ON GEBC.user_id = u.id WHERE u.is_deleted = FALSE;`;
    
      const totalGEBCResult = await pool.query(countQuery);
      const totalGEBC = totalGEBCResult.rows[0].count;
      const totalPages = Math.ceil(totalGEBC / perPage);

      res.status(200).json({
        statusCode: 200,
        totalGEBC,
        totalPages,
        AllQAFIs: rows,
      });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ statusCode: 500, message: "Internal server error", error });
  }
};

export const getAllGEBCByUser = async (req, res) => {
  try {
    const { id } = req.params;
    const checkQuery =
    "SELECT * FROM users WHERE id = $1 AND users.is_deleted=FALSE";
  const checkResult = await pool.query(checkQuery, [id]);

  if (checkResult.rowCount === 0) {
    return res
      .status(404)
      .json({ statusCode: 404, message: "User does not exist" });
  }
    const page = parseInt(req.query.page || 1); // Get the page number from the query parameters
    const perPage = parseInt(req.query.limit || 10); // Number of results per page

    const offset = (page - 1) * perPage;

    const countQuery = `SELECT COUNT(*) FROM GEBC WHERE user_id=$1;`;
    const countResult = await pool.query(countQuery, [id]);
    const totalGEBCs = parseInt(countResult.rows[0].count);

    const totalPages = Math.ceil(totalGEBCs / perPage);
    const query = `SELECT
    v.id AS GEBC_id,
    v.description,
    v.disc_category,
    v.image,
    v.created_at AS tour_created_at,
    v.user_id,
    u.username AS username,
    u.image AS userImage
  
FROM GEBC v
JOIN users u ON v.user_id = u.id
WHERE v.user_id = $1
GROUP BY v.id, u.username, u.image
LIMIT $2 OFFSET $3;
 `;

    const { rows } = await pool.query(query, [id, perPage, offset]);

    return res
      .status(200)
      .json({ statusCode: 200, totalPages, totalGEBCs, GEBCs: rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllGEBCsByCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const checkQuery =
    "SELECT * FROM disc_category WHERE id = $1";
  const checkResult = await pool.query(checkQuery, [id]);

  if (checkResult.rowCount === 0) {
    return res
      .status(404)
      .json({ statusCode: 404, message: "Disc category not exist" });
  }
    let page = parseInt(req.query.page || 1); // Get the page number from the query parameters
    const perPage = parseInt(req.query.limit || 5);

    const offset = (page - 1) * perPage;

    const countQuery = `SELECT COUNT(*) FROM 
    GEBC
    JOIN users u ON GEBC.user_id = u.id
    WHERE GEBC.disc_category=$1 AND u.is_deleted=FALSE;`;
    const countResult = await pool.query(countQuery, [id]);
    const totalGEBCs = parseInt(countResult.rows[0].count);

    const totalPages = Math.ceil(totalGEBCs / perPage);
    const query = `SELECT
    v.id AS GEBC_id,
    v.description,
    v.disc_category,
    v.image,
    v.created_at AS tour_created_at,
    v.user_id,
    u.username AS username,
    u.image AS userImage
      
    FROM GEBC v
    JOIN users u ON v.user_id = u.id
    WHERE v.disc_category = $1 AND u.is_deleted=FALSE
    GROUP BY v.id, u.username, u.image
    LIMIT $2 OFFSET $3;
     `;

    const { rows } = await pool.query(query, [id, perPage, offset]);

    return res
      .status(200)
      .json({ statusCode: 200, totalPages, totalGEBCs, GEBCs: rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const searchGEBCs = async (req, res) => {
  try {
    const { name } = req.query;

    // Split the search query into individual words
    const searchWords = name.split(/\s+/).filter(Boolean);

    if (searchWords.length === 0) {
      return res.status(200).json({ statusCode: 200, Suppliers: [] });
    }

    // Create an array of conditions for each search word
    const conditions = searchWords.map((word) => {
      return `(description ILIKE '%${word}%')`;
    });

    const query = `SELECT
    v.id AS GEBC_id,
    v.description,
    v.disc_category,
    v.image,
    v.created_at AS tour_created_at,
    v.user_id,
    u.username AS username,
    u.image AS userImage
        FROM GEBC v
        JOIN users u ON v.user_id = u.id
        WHERE ${conditions.join(" OR ")} AND u.is_deleted=FALSE
        ORDER BY v.created_at DESC
        `;

    const { rows } = await pool.query(query);

    return res.status(200).json({
      statusCode: 200,
      totalGEBCs: rows.length,
      GEBCs: rows,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
