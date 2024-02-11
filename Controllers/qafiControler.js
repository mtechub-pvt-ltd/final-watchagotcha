import pool from "../db.config/index.js";
import { getAllRows, getSingleRow } from "../queries/common.js";
import { handle_delete_photos_from_folder } from "../utils/handleDeletePhoto.js";
export const createQafi = async (req, res) => {
  try {
    const {  description, disc_category, user_id,image } = req.body;
    const checkQuery1 =
    "SELECT * FROM users WHERE id = $1 AND is_deleted=FALSE";
    const checkResult1 = await pool.query(checkQuery1, [user_id]);

    if (checkResult1.rowCount === 0) {
      // handle_delete_photos_from_folder([req.file?.filename], "qafiImages");
      return res
        .status(404)
        .json({ statusCode: 404, message: "user not exist" });
    }
    // if (req.file) {
      // let imagePath = `/qafiImages/${req.file.filename}`;
      const createQuery =
        "INSERT INTO QAFI (description,disc_category,image,user_id) VALUES($1,$2,$3,$4) RETURNING *";
      const result = await pool.query(createQuery, [
        description,
        disc_category,
        // imagePath,
        image,
        user_id,
      ]);
      if (result.rowCount === 1) {
        const query = `SELECT
    v.id AS qafi_id,
    v.description,
    v.disc_category,
    v.image,
    v.created_at AS tour_created_at,
    v.user_id,
    u.username AS username,
    u.image AS userImage
    
FROM QAFI v
JOIN users u ON v.user_id = u.id
WHERE v.id = $1
GROUP BY v.id, u.username, u.image;

 
 `;
 const data=await pool.query(query,[result.rows[0].id])
        return res.status(201).json({
          statusCode: 201,
          message: "QAFI posted successfully",
          data: data.rows[0],
        });
      }
      res.status(400).json({ statusCode: 400, message: "Not uploaded" });
    // } else {
    //   res.status(400).json({ statusCode: 400, message: "image not uploaded" });
    // }
  } catch (error) {
    console.error(error);
    handle_delete_photos_from_folder([req.file?.filename], "qafiImages");
    if (error.constraint === 'qafi_disc_category_fkey') {
      return res.status(400).json({ statusCode: 400, message: "disc category does not exist" });
    } else if (error.constraint === 'qafi_user_id_fkey') {
      return res.status(400).json({ statusCode: 400, message: "user does not exist" });
    }
    res.status(500).json({ statusCode: 500, message: "Internal server error" });
  }
};

export const deleteQafi = async (req, res) => {
  const { id } = req.params;
  try {
    const condition = {
      column: "id",
      value: id,
    };
    const oldImage = await getSingleRow("qafi", condition);
    if (oldImage.length === 0) {
      return res
        .status(404)
        .json({ statusCode: 404, message: "Qafi not found " });
    }
    const oldImageSplit = oldImage[0].image.replace("/qafiImages/", "");
    const delQuery = "DELETE FROM qafi WHERE id=$1";
    const result = await pool.query(delQuery, [id]);
    if (result.rowCount === 0) {
      return res
        .status(404)
        .json({ statusCode: 404, message: "Qafi not deleted" });
    }
    handle_delete_photos_from_folder([oldImageSplit], "qafiImages");
    res.status(200).json({
      statusCode: 200,
      message: "Qafi deleted successfully",
      deletedQafi: oldImage[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ statusCode: 500, message: "Internal server error" });
  }
};
export const updateQafi = async (req, res) => {
  try {
    const { id, description, disc_category,image } = req.body;
    const condition = {
      column: "id",
      value: id,
    };
    const oldImage = await getSingleRow("qafi", condition);
    console.log(oldImage);
    if (oldImage.length === 0) {
      return res
        .status(404)
        .json({ statusCode: 404, message: "Qafi not found " });
    }
    let updateData = {
      image: oldImage[0].image,
    };
    if (image) {
      updateData.image =image;
      const imageSplit = oldImage[0].image.replace("/fileUpload/", "");
      handle_delete_photos_from_folder([imageSplit], "fileUpload");
    }

    const updateType = `UPDATE qafi SET description=$1,disc_category=$2,image=$3,"updated_at"=NOW() WHERE id=$4 RETURNING *`;
    const result = await pool.query(updateType, [
      description,
      disc_category,
      updateData.image,
      id,
    ]);
    if (result.rowCount === 1) {
      const query = `SELECT
    v.id AS qafi_id,
    v.description,
    v.disc_category,
    v.image,
    v.created_at AS tour_created_at,
    v.user_id,
    u.username AS username,
    u.image AS userImage
    
FROM QAFI v
JOIN users u ON v.user_id = u.id
WHERE v.id = $1
GROUP BY v.id, u.username, u.image;
 `;
 const data=await pool.query(query,[id])
      return res
        .status(200)
        .json({
          statusCode: 200,
          message: "QAFI updated successfully",
          updateQafi: data.rows[0],
        });
    } else {
      res
        .status(404)
        .json({ statusCode: 404, message: "Operation not successfull" });
    }
  } catch (error) {
    console.error(error);
    if (error.constraint === 'qafi_disc_category_fkey') {
      return res.status(400).json({ statusCode: 400, message: "Disc category does not exist" });
    }
    res.status(500).json({ message: "Internal server error" });
  }
};
export const deleteAllQAFIs= async (req, res) => {
  try {
    // Perform a query to delete all users from the database
    const query = "DELETE FROM qafi RETURNING *";
    const { rows } = await pool.query(query);

    if (rows.length === 0) {
      return res.status(404).json({
        statusCode: 404,
        message: "No qafi found to delete",
      });
    }
    const imageFilenames = rows.map((news) => news.image.replace("/qafiImages/", ""));
    handle_delete_photos_from_folder(imageFilenames, 'qafiImages');
    res.status(200).json({
      statusCode: 200,
      message: "All QAFIs deleted successfully",
      deletedQAFIs: rows,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ statusCode: 500, message: "Internal server error" });
  }
};
export const sendComment = async (req, res) => {
  try {
    const { QAFI_id, user_id, comment } = req.body;
    const checkQuery =
    "SELECT * FROM qafi WHERE id = $1";
  const checkResult = await pool.query(checkQuery, [QAFI_id]);

  if (checkResult.rowCount === 0) {
    return res
      .status(404)
      .json({ statusCode: 404, message: "QAFI not exist" });
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
      "INSERT INTO qafi_comment (QAFI_id,user_id,comment) VALUES($1,$2,$3) RETURNING *";
    const result = await pool.query(createQuery, [
      QAFI_id,
      user_id,
      comment,
    ]);
    if (result.rowCount === 1) {
      let commentQuery = `SELECT 
      v.QAFI_id AS qafi_id,
      v.id AS commentId,
            v.comment AS comment,
            u.id AS userId,
            u.username AS username,
            u.image AS userImage
            FROM qafi_comment v
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
export const getAllCommentsByQAFI = async (req, res) => {
  try {
    const { id } = req.params;
    const checkQuery =
    "SELECT * FROM qafi WHERE id = $1";
  const checkResult = await pool.query(checkQuery, [id]);

  if (checkResult.rowCount === 0) {
    return res
      .status(404)
      .json({ statusCode: 404, message: "QAFI not exist" });
  }

    let commentQuery = `SELECT v.id AS commentId,
      v.comment AS comment,
      u.id AS userId,
      u.username AS username,
      u.image AS userImage
      FROM qafi_comment v
      LEFT JOIN users u ON v.user_id = u.id
      WHERE QAFI_id=$1
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

export const likeUnlikeQafi = async (req, res) => {
  try {
    const { QAFI_id, user_id } = req.body;
    const checkQafiQuery =
    "SELECT * FROM qafi WHERE id = $1";
  const checkQafiResult = await pool.query(checkQafiQuery, [QAFI_id]);

  if (checkQafiResult.rowCount === 0) {
    return res
      .status(404)
      .json({ statusCode: 404, message: "QAFI not exist" });
  }

    // Check if the user has already liked the video
    const checkQuery =
      "SELECT * FROM like_qafi WHERE QAFI_id = $1 AND user_id = $2";
    const checkResult = await pool.query(checkQuery, [QAFI_id, user_id]);

    if (checkResult.rowCount > 0) {
        const createQuery = "DELETE FROM like_qafi WHERE user_id=$1 AND QAFI_id=$2 RETURNING *";
        const result = await pool.query(createQuery, [user_id,QAFI_id]);
        if (result.rowCount === 1) {
          return res.status(200).json({
            statusCode: 201,
            message: "QAFI Unlike successfully",
            data: result.rows[0],
          });
        }
    //   return res
    //     .status(400)
    //     .json({
    //       statusCode: 400,
    //       message: "User has already liked the pic tour",
    //     });
    }
    const createQuery =
      "INSERT INTO like_qafi (QAFI_id,user_id) VALUES($1,$2) RETURNING *";
    const result = await pool.query(createQuery, [QAFI_id, user_id]);
    if (result.rowCount === 1) {
      return res.status(201).json({
        statusCode: 201,
        message: "Qafi like successfully",
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
export const getAllLikesByQafi= async (req, res) => {
    try {
      const { id } = req.params;
      let likeQuery = `SELECT v.*
        FROM like_qafi v
        WHERE QAFI_id=$1
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

export const getSpecificQafi = async (req, res) => {
  try {
    const { id } = req.params;
    const query = `SELECT
    v.id AS qafi_id,
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
        FROM qafi_comment c
        JOIN users cu ON c.user_id = cu.id
        WHERE c.QAFI_id = v.id
    ) AS comments,
    (
        SELECT COALESCE(json_agg(
            json_build_object(
                'id', lv.id,
                'user_id', lv.user_id,
                'QAFI_id', v.id,
                'created_at', lu.created_at,
                'updated_at', lu.updated_at
            )
        ), '[]'::json)
        FROM like_qafi lv
        JOIN users lu ON lv.user_id = lu.id
        WHERE lv.QAFI_id = v.id
    ) AS likes
FROM QAFI v
JOIN users u ON v.user_id = u.id
WHERE v.id = $1 AND u.is_deleted=FALSE
GROUP BY v.id, u.username, u.image;

 
 `;

    const { rows } = await pool.query(query, [id]);

      return res.status(200).json({ statusCode: 200, QAFI: rows[0] || [] });
   
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const getAllQAFIs = async (req, res) => {
  try {
    let page = parseInt(req.query.page); // Get the page number from the query parameters
    const perPage = parseInt(req.query.limit);
    const offset = (page - 1) * perPage;
    let getQuery = `SELECT
    v.id AS qafi_id,
    v.description,
    v.disc_category,
    v.image,
    v.created_at AS tour_created_at,
    v.user_id,
    u.username AS username,
    u.image AS userImage
  FROM qafi v
  JOIN users u ON v.user_id = u.id
  WHERE u.is_deleted = FALSE
  ORDER BY v.created_at DESC
  `;

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
        totalQAFIs: rows.length,
        AllQAFIs: rows,
      });
    } else {
      // Calculate the total number of categories (without pagination)
      const countQuery = `SELECT COUNT(*) FROM qafi JOIN users u ON qafi.user_id = u.id WHERE u.is_deleted = FALSE;`;
    
      const totalQAFIsResult = await pool.query(countQuery);
      const totalQAFIs = totalQAFIsResult.rows[0].count;
      const totalPages = Math.ceil(totalQAFIs / perPage);

      res.status(200).json({
        statusCode: 200,
        totalQAFIs,
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

export const getAllQafisByUser = async (req, res) => {
  try {
    const { id } = req.params;
    const checkQuery =
    "SELECT * FROM users WHERE id = $1 AND is_deleted=FALSE";
  const checkResult = await pool.query(checkQuery, [id]);

  if (checkResult.rowCount === 0) {
    return res
      .status(404)
      .json({ statusCode: 404, message: "User does not exist" });
  }
    const page = parseInt(req.query.page || 1); // Get the page number from the query parameters
    const perPage = parseInt(req.query.limit || 10); // Number of results per page

    const offset = (page - 1) * perPage;

    const countQuery = `SELECT COUNT(*) FROM qafi WHERE user_id=$1;`;
    const countResult = await pool.query(countQuery, [id]);
    const totalQAFIs = parseInt(countResult.rows[0].count);

    const totalPages = Math.ceil(totalQAFIs / perPage);
    const query = `SELECT
    v.id AS qafi_id,
    v.description,
    v.disc_category,
    v.image,
    v.created_at AS tour_created_at,
    v.user_id,
    u.username AS username,
    u.image AS userImage
  
FROM qafi v
JOIN users u ON v.user_id = u.id
WHERE v.user_id = $1
GROUP BY v.id, u.username, u.image
LIMIT $2 OFFSET $3;
 `;

    const { rows } = await pool.query(query, [id, perPage, offset]);

    return res
      .status(200)
      .json({ statusCode: 200, totalPages, totalQAFIs, QAFIs: rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllQafisByCategory = async (req, res) => {
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

    const countQuery = `SELECT COUNT(*) FROM QAFI WHERE disc_category=$1;`;
    const countResult = await pool.query(countQuery, [id]);
    const totalQAFIs = parseInt(countResult.rows[0].count);

    const totalPages = Math.ceil(totalQAFIs / perPage);
    const query = `SELECT
    v.id AS qafi_id,
    v.description,
    v.disc_category,
    v.image,
    v.created_at AS tour_created_at,
    v.user_id,
    u.username AS username,
    u.image AS userImage
      
    FROM qafi v
    JOIN users u ON v.user_id = u.id
    WHERE v.disc_category = $1 AND u.is_deleted=FALSE
    GROUP BY v.id, u.username, u.image
    LIMIT $2 OFFSET $3;
     `;

    const { rows } = await pool.query(query, [id, perPage, offset]);

    return res
      .status(200)
      .json({ statusCode: 200, totalPages, totalQAFIs, QAFIs: rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const searchQafi = async (req, res) => {
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
    v.id AS qafi_id,
    v.description,
    v.disc_category,
    v.image,
    v.created_at AS tour_created_at,
    v.user_id,
    u.username AS username,
    u.image AS userImage
        FROM qafi v
        JOIN users u ON v.user_id = u.id
        WHERE ${conditions.join(" OR ")} AND u.is_deleted=FALSE
        ORDER BY v.created_at DESC
        `;

    const { rows } = await pool.query(query);

    return res.status(200).json({
      statusCode: 200,
      totalQAFIs: rows.length,
      QAFIs: rows,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
