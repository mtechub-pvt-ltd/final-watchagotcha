import pool from "../db.config/index.js";
import { getAllRows, getSingleRow } from "../queries/common.js";
import { handle_delete_photos_from_folder } from "../utils/handleDeletePhoto.js";
export const createPicTour = async (req, res) => {
  try {
    const { name, description, pic_category, user_id,image } = req.body;
    // if (req.file) {
      // let imagePath = `/picTourImages/${req.file.filename}`;
      const createQuery =
        "INSERT INTO pic_tours (name,description,pic_category,image,user_id) VALUES($1,$2,$3,$4,$5) RETURNING *";
      const result = await pool.query(createQuery, [
        name,
        description,
        pic_category,
        // imagePath,
        image,
        user_id,
      ]);
      if (result.rowCount === 1) {
        const query = `SELECT
        v.id AS tour_id,
        v.description,
        v.pic_category,
        v.image,
        v.created_at AS tour_created_at,
        v.user_id,
        u.username AS username,
        u.image AS userImage
        
    FROM pic_tours v
    JOIN users u ON v.user_id = u.id
    WHERE v.id = $1
    GROUP BY v.id, u.username, u.image;
    
     
     `;
     const data=await pool.query(query,[result.rows[0].id])
        return res.status(201).json({
          statusCode: 201,
          message: "Pic tour uploaded successfully",
          data: data.rows[0],
        });
      }
      res.status(400).json({ statusCode: 400, message: "Not uploaded" });
    // } else {
    //   res.status(400).json({ statusCode: 400, message: "image not uploaded" });
    // }
  } catch (error) {
    console.error(error);
    handle_delete_photos_from_folder([req.file?.filename], "picTourImages");
    if (error.constraint === 'pic_tours_pic_category_fkey') {
     return  res.status(400).json({ statusCode: 400, message: "Pic category does not exist" });
    } else if (error.constraint === 'pic_tours_user_id_fkey') {
     return  res.status(400).json({ statusCode: 400, message: "user does not exist" });
    }
    res.status(500).json({ statusCode: 500, message: "Internal server error" });
  }
};

export const deletePicTour = async (req, res) => {
  const { id } = req.params;
  try {
    const condition = {
      column: "id",
      value: id,
    };
    const oldImage = await getSingleRow("pic_tours", condition);
    if (oldImage.length === 0) {
      return res
        .status(404)
        .json({ statusCode: 404, message: "Pic tour not found " });
    }
    const oldImageSplit = oldImage[0].image.replace("/picTourImages/", "");
    const delQuery = "DELETE FROM pic_tours WHERE id=$1";
    const result = await pool.query(delQuery, [id]);
    if (result.rowCount === 0) {
      return res
        .status(404)
        .json({ statusCode: 404, message: "Pic tour not deleted" });
    }
    handle_delete_photos_from_folder([oldImageSplit], "picTourImages");
    res.status(200).json({
      statusCode: 200,
      message: "Pic Tour deleted successfully",
      deletedPicTour: oldImage[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ statusCode: 500, message: "Internal server error" });
  }
};
export const updatePicTour = async (req, res) => {
  try {
    const { id, name, description, pic_category,image } = req.body;
    const condition = {
      column: "id",
      value: id,
    };
    const oldImage = await getSingleRow("pic_tours", condition);
    console.log(oldImage);
    if (oldImage.length === 0) {
      // handle_delete_photos_from_folder([req.file?.filename], "picTourImages");
      return res
        .status(404)
        .json({ statusCode: 404, message: "Pic Tour not found " });
    }
    const checkQuery1 =
    "SELECT * FROM users WHERE id = $1 AND is_deleted=FALSE";
    const checkResult1 = await pool.query(checkQuery1, [oldImage[0].user_id]);

    if (checkResult1.rowCount === 0) {
      // handle_delete_photos_from_folder([req.file?.filename], "picTourImages");
      return res
        .status(404)
        .json({ statusCode: 404, message: "user not exist" });
    }
    let updateData = {
      image: oldImage[0].image,
    };
    if (image) {
      updateData.image = image;
      const imageSplit = oldImage[0].image.replace("/fileUpload/", "");
      handle_delete_photos_from_folder([imageSplit], "fileUpload");
    }

    const updateType = `UPDATE pic_tours SET name=$1,description=$2,pic_category=$3,image=$4,"updated_at"=NOW() WHERE id=$5 RETURNING *`;
    const result = await pool.query(updateType, [
      name,
      description,
      pic_category,
      updateData.image,
      id,
    ]);
    if (result.rowCount === 1) {
      const query = `SELECT
        v.id AS tour_id,
        v.name,
        v.description,
        v.pic_category,
        v.image,
        v.created_at AS tour_created_at,
        v.user_id,
        u.username AS username,
        u.image AS userImage
        
    FROM pic_tours v
    JOIN users u ON v.user_id = u.id
    WHERE v.id = $1
    GROUP BY v.id, u.username, u.image;
    
     
     `;
     const data=await pool.query(query,[result.rows[0].id])
      return res
        .status(200)
        .json({
          statusCode: 200,
          message: "Pic Tour updated successfully",
          updatePicTour: data.rows[0],
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
export const deleteAllPicTours = async (req, res) => {
  try {
    // Perform a query to delete all users from the database
    const query = "DELETE FROM pic_tours RETURNING *";
    const { rows } = await pool.query(query);

    if (rows.length === 0) {
      return res.status(404).json({
        statusCode: 404,
        message: "No pic tour found to delete",
      });
    }
    const imageFilenames = rows.map((news) => news.image.replace("/picTourImages/", ""));
    handle_delete_photos_from_folder(imageFilenames, 'picTourImages');
    res.status(200).json({
      statusCode: 200,
      message: "All Pic Tours deleted successfully",
      deletedVideos: rows,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ statusCode: 500, message: "Internal server error" });
  }
};
export const sendComment = async (req, res) => {
  try {
    const { pic_tours_id, user_id, comment } = req.body;
    const checkQuery1 =
    "SELECT * FROM users WHERE id = $1 AND is_deleted=FALSE";
    const checkResult1 = await pool.query(checkQuery1, [user_id]);

    if (checkResult1.rowCount === 0) {
      handle_delete_photos_from_folder([req.file?.filename], "picTourImages");
      return res
        .status(404)
        .json({ statusCode: 404, message: "user not exist" });
    }
    const createQuery =
      "INSERT INTO pic_comment (pic_tours_id,user_id,comment) VALUES($1,$2,$3) RETURNING *";
    const result = await pool.query(createQuery, [
      pic_tours_id,
      user_id,
      comment,
    ]);
    if (result.rowCount === 1) {
      let commentQuery = `SELECT 
      v.pic_tours_id AS tour_id,
      v.id AS commentId,
            v.comment AS comment,
            u.id AS userId,
            u.username AS username,
            u.image AS userImage
            FROM pic_comment v
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
    if (error.constraint === 'pic_comment_pic_tours_id_fkey') {
      return res.status(400).json({ statusCode: 400, message: "Pic tour does not exist" });
    } else if (error.constraint === 'pic_comment_user_id_fkey') {
      return res.status(400).json({ statusCode: 400, message: "user does not exist" });
    }
    res.status(500).json({ statusCode: 500, message: "Internal server error" });
  }
};
export const getAllCommentsByPicTours = async (req, res) => {
  try {
    const { id } = req.params;
    let commentQuery = `SELECT v.id AS commentId,
      v.comment AS comment,
      u.id AS userId,
      u.username AS username,
      u.image AS userImage
      FROM pic_comment v
      LEFT JOIN users u ON v.user_id = u.id
      WHERE pic_tours_id=$1 AND u.is_deleted=FALSE
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

export const likePicTour = async (req, res) => {
  try {
    const { pic_tour_id, user_id } = req.body;
    
    // Check if the user has already liked the video
    const checkQuery =
      "SELECT * FROM like_pic WHERE pic_tours_id = $1 AND user_id = $2";
    const checkResult = await pool.query(checkQuery, [pic_tour_id, user_id]);

    if (checkResult.rowCount > 0) {
      // The user has already liked the video, return an error
      return res
        .status(400)
        .json({
          statusCode: 400,
          message: "User has already liked the pic tour",
        });
    }
    const createQuery =
      "INSERT INTO like_pic (pic_tours_id,user_id) VALUES($1,$2) RETURNING *";
    const result = await pool.query(createQuery, [pic_tour_id, user_id]);
    if (result.rowCount === 1) {
      return res.status(201).json({
        statusCode: 201,
        message: "Pic tour like successfully",
        data: result.rows[0],
      });
    }
    res.status(400).json({ statusCode: 400, message: "Not uploaded" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ statusCode: 500, message: "Internal server error" });
  }
};
export const likeUnlikePicTour = async (req, res) => {
  try {
    const { pic_tour_id, user_id } = req.body;
    const checkQuery1 =
    "SELECT * FROM users WHERE id = $1 AND is_deleted=FALSE";
    const checkResult1 = await pool.query(checkQuery1, [user_id]);

    if (checkResult1.rowCount === 0) {
      handle_delete_photos_from_folder([req.file?.filename], "picTourImages");
      return res
        .status(404)
        .json({ statusCode: 404, message: "user not exist" });
    }
    const checkQafiQuery =
    "SELECT * FROM pic_tours WHERE id = $1";
  const checkQafiResult = await pool.query(checkQafiQuery, [pic_tour_id]);

  if (checkQafiResult.rowCount === 0) {
    return res
      .status(404)
      .json({ statusCode: 404, message: "Pic Tour not exist" });
  }

    // Check if the user has already liked the video
    const checkQuery =
      "SELECT * FROM like_pic WHERE pic_tours_id = $1 AND user_id = $2";
    const checkResult = await pool.query(checkQuery, [pic_tour_id, user_id]);

    if (checkResult.rowCount > 0) {
        const createQuery = "DELETE FROM like_pic WHERE user_id=$1 AND pic_tours_id=$2 RETURNING *";
        const result = await pool.query(createQuery, [user_id,pic_tour_id]);
        if (result.rowCount === 1) {
          return res.status(200).json({
            statusCode: 201,
            message: "Tour Unlike successfully",
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
      "INSERT INTO like_pic (pic_tours_id,user_id) VALUES($1,$2) RETURNING *";
    const result = await pool.query(createQuery, [pic_tour_id, user_id]);
    if (result.rowCount === 1) {
      return res.status(201).json({
        statusCode: 201,
        message: "Tour like successfully",
        data: result.rows[0],
      });
    }
    res.status(400).json({ statusCode: 400, message: "Not uploaded" });
  } catch (error) {
    console.error(error);
    if (error.constraint === 'like_pic_pic_tours_id_fkey') {
      return res.status(400).json({ statusCode: 400, message: "Pic tour does not exist" });
    } else if (error.constraint === 'like_pic_user_id_fkey') {
      return res.status(400).json({ statusCode: 400, message: "user does not exist" });
    }
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
export const getAllLikesByPicTour = async (req, res) => {
  try {
    const { id } = req.params;
    let likeQuery = `SELECT v.*
      FROM like_pic v
      LEFT JOIN users ON v.user_id =users.id
      WHERE pic_tours_id=$1 AND users.is_deleted=FALSE
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

export const getSpecificPicTour = async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id } = req.query;

    let sqlQuery = `
      SELECT
        v.id AS pic_tour_id,
        v.name,
        v.description,
        v.pic_category,
        v.image,
        v.created_at AS tour_created_at,
        v.user_id,
        u.username AS username,
        u.image AS userImage,
        (SELECT COUNT(*) FROM like_pic lv WHERE lv.pic_tours_id = v.id) AS like_count,
    (SELECT COUNT(*) FROM pic_comment c WHERE c.pic_tours_id = v.id) AS comment_count,
    (SELECT COUNT(*) FROM viewed_pic vv WHERE vv.pic_tours_id = v.id) AS view_count,
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
          FROM pic_comment c
          JOIN users cu ON c.user_id = cu.id
          WHERE c.pic_tours_id = v.id
        ) AS comments,
        (
          SELECT COALESCE(json_agg(
            json_build_object(
              'id', lv.id,
              'user_id', lv.user_id,
              'pic_tours_id', v.id,
              'created_at', lu.created_at,
              'updated_at', lu.updated_at
            )
          ), '[]'::json)
          FROM like_pic lv
          JOIN users lu ON lv.user_id = lu.id 
          WHERE lv.pic_tours_id = v.id 
        ) AS likes`;

    if (user_id) {
      sqlQuery += `,
        CASE WHEN pl.id IS NOT NULL THEN true ELSE false END AS is_liked`;
    }

    sqlQuery += `
      FROM pic_tours v
      JOIN users u ON v.user_id = u.id`;

    if (user_id) {
      sqlQuery += `
        LEFT JOIN like_pic pl ON v.id = pl.pic_tours_id AND pl.user_id = $2`;
    }
 if(user_id){
  sqlQuery += `
      WHERE v.id = $1 AND u.is_deleted=FALSE
      GROUP BY v.id, u.username, u.image,pl.id`;
 }else{
  sqlQuery += `
  WHERE v.id = $1 AND u.is_deleted=FALSE
  GROUP BY v.id, u.username, u.image`;
 }
    

    const queryParams = [id];

    if (user_id) {
      queryParams.push(user_id);
    }

    const { rows } = await pool.query(sqlQuery, queryParams);
    
    if (rows.length > 0) {
      return res.status(200).json({ statusCode: 200, picTour: rows[0] });
    } else {
      res.status(404).json({ statusCode: 404, message: "No pic tour found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllPicTour = async (req, res) => {
  try {
    const page = parseInt(req.query.page || 1); // Get the page number from the query parameters
    const perPage = parseInt(req.query.limit || 10); // Number of results per page

    const offset = (page - 1) * perPage;

    const countQuery = `SELECT COUNT(*) FROM pic_tours  JOIN users u ON pic_tours.user_id = u.id
    WHERE u.is_deleted=FALSE;`;
    const countResult = await pool.query(countQuery);
    const totalTours = parseInt(countResult.rows[0].count);

    const totalPages = Math.ceil(totalTours / perPage);

    const query = `SELECT
          v.id AS pic_tour_id,
          v.name,
          v.description,
          v.pic_category,
          v.image,
          v.created_at AS tour_created_at,
          v.user_id,
          u.username AS username,
          u.image AS userImage
        
      FROM pic_tours v
      JOIN users u ON v.user_id = u.id
      WHERE u.is_deleted=FALSE
      ORDER BY v.created_at DESC
      LIMIT $1 OFFSET $2;`;

    const { rows } = await pool.query(query, [perPage, offset]);

    return res.status(200).json({
      statusCode: 200,
      totalPages,
      totalTours,
      Tours: rows,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllPicToursByUser = async (req, res) => {
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

    const countQuery = `SELECT COUNT(*) FROM pic_tours WHERE user_id=$1;`;
    const countResult = await pool.query(countQuery, [id]);
    const totalTours = parseInt(countResult.rows[0].count);

    const totalPages = Math.ceil(totalTours / perPage);
    const query = `SELECT
    v.id AS pic_tour_id,
    v.name,
    v.description,
    v.pic_category,
    v.image,
    v.created_at AS tour_created_at,
    v.user_id,
    u.username AS username,
    u.image AS userImage
  
FROM pic_tours v
JOIN users u ON v.user_id = u.id
WHERE v.user_id = $1
GROUP BY v.id, u.username, u.image
ORDER BY v.created_at DESC
LIMIT $2 OFFSET $3;
 `;

    const { rows } = await pool.query(query, [id, perPage, offset]);

    return res
      .status(200)
      .json({ statusCode: 200, totalPages, totalTours, Tours: rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const getAllRecentToursByCategory = async (req, res) => {
  try {
    const {id}=req.params
    const checkQuery =
    "SELECT * FROM pic_category WHERE id = $1";
  const checkResult = await pool.query(checkQuery, [id]);

  if (checkResult.rowCount === 0) {
    return res
      .status(404)
      .json({ statusCode: 404, message: "pic Category not exist" });
  }
    const page = parseInt(req.query.page || 1); // Get the page number from the query parameters
    const perPage = parseInt(req.query.limit || 10); // Number of results per page

    const offset = (page - 1) * perPage;

    const countQuery = `SELECT COUNT(*) FROM pic_tours 
    JOIN users u ON pic_tours.user_id = u.id
    WHERE u.is_deleted=FALSE
    ;`;
    const countResult = await pool.query(countQuery);
    const totalTours = parseInt(countResult.rows[0].count);

    const totalPages = Math.ceil(totalTours / perPage);

    const query = `SELECT
    v.id AS pic_tour_id,
    v.name,
    v.description,
    v.pic_category,
    v.image,
    v.created_at AS tour_created_at,
    v.user_id,
    u.username AS username,
    u.image AS userImage
         
      FROM pic_tours v
      JOIN users u ON v.user_id = u.id
      WHERE v.pic_category=$3 AND u.is_deleted=FALSE
      ORDER BY v.created_at DESC
      LIMIT $1 OFFSET $2;`;

    const { rows } = await pool.query(query, [perPage, offset,id]);

    return res.status(200).json({
      statusCode: 200,
      totalPages,
      totalTours,
      Tours: rows,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const getAllPicTourByCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const checkQuery =
    "SELECT * FROM pic_category WHERE id = $1";
  const checkResult = await pool.query(checkQuery, [id]);

  if (checkResult.rowCount === 0) {
    return res
      .status(404)
      .json({ statusCode: 404, message: "Pic category not exist" });
  }
    let page = parseInt(req.query.page || 1); // Get the page number from the query parameters
    const perPage = parseInt(req.query.limit || 5);

    const offset = (page - 1) * perPage;

    const countQuery = `SELECT COUNT(*) FROM pic_tours v JOIN users u ON v.user_id = u.id
    
    WHERE v.pic_category=$1 AND u.is_deleted=FALSE;`;
    const countResult = await pool.query(countQuery, [id]);
    const totalTours = parseInt(countResult.rows[0].count);

    const totalPages = Math.ceil(totalTours / perPage);
    const query = `SELECT
    v.id AS pic_tour_id,
    v.name,
    v.description,
    v.pic_category,
    v.image,
    v.created_at AS tour_created_at,
    v.user_id,
    u.username AS username,
    u.image AS userImage
  
      
    FROM pic_tours v
    JOIN users u ON v.user_id = u.id
    WHERE v.pic_category = $1 AND u.is_deleted=FALSE
    GROUP BY v.id, u.username, u.image
    ORDER BY v.created_at DESC
    LIMIT $2 OFFSET $3;
     `;

    const { rows } = await pool.query(query, [id, perPage, offset]);

    return res
      .status(200)
      .json({ statusCode: 200, totalPages, totalTours, Tours: rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const getMostViewedToursByCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const checkQuery =
    "SELECT * FROM pic_category WHERE id = $1";
  const checkResult = await pool.query(checkQuery, [id]);

  if (checkResult.rowCount === 0) {
    return res
      .status(404)
      .json({ statusCode: 404, message: "pic Category not exist" });
  }
    const page = parseInt(req.query.page || 1); // Get the page number from the query parameters
    const perPage = parseInt(req.query.limit || 10); // Number of results per page

    const offset = (page - 1) * perPage;

    const countQuery = `SELECT COUNT(*) FROM pic_tours
    JOIN users u ON pic_tours.user_id = u.id
    WHERE pic_category=$1 AND u.is_deleted=FALSE;`;
    const countResult = await pool.query(countQuery, [id]);
    const totalTours = parseInt(countResult.rows[0].count);

    const totalPages = Math.ceil(totalTours / perPage);
    const query = `SELECT
    v.id AS pic_tour_id,
    v.name,
    v.description,
    v.pic_category,
    v.image,
    v.created_at AS tour_created_at,
    v.user_id,
    u.username AS username,
    u.image AS userImage,
      COUNT(vv.pic_tours_id) AS view_count
    
  FROM pic_tours v
  JOIN users u ON v.user_id = u.id
  LEFT JOIN viewed_pic vv ON v.id = vv.pic_tours_id
  WHERE v.pic_category = $1 AND u.is_deleted=FALSE
  GROUP BY v.id, u.username, u.image
  ORDER BY view_count DESC
      LIMIT $2 OFFSET $3;
       `;

    const { rows } = await pool.query(query, [id, perPage, offset]);

    return res
      .status(200)
      .json({ statusCode: 200, totalPages, totalTours, Tours: rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllTrendingToursByCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const checkQuery =
    "SELECT * FROM pic_category WHERE id = $1";
  const checkResult = await pool.query(checkQuery, [id]);

  if (checkResult.rowCount === 0) {
    return res
      .status(404)
      .json({ statusCode: 404, message: "pic Category not exist" });
  }
    const page = parseInt(req.query.page || 1); // Get the page number from the query parameters
    const perPage = parseInt(req.query.limit || 10); // Number of results per page

    const offset = (page - 1) * perPage;

    const countQuery = `SELECT COUNT(*) FROM pic_tours
    JOIN users u ON pic_tours.user_id = u.id
    WHERE pic_category=$1 AND u.is_deleted=FALSE;`;
    const countResult = await pool.query(countQuery, [id]);
    const totalTours = parseInt(countResult.rows[0].count);

    const totalPages = Math.ceil(totalTours / perPage);
    const query = `SELECT
    v.id AS pic_tour_id,
    v.name,
    v.description,
    v.pic_category,
    v.image,
    v.created_at AS tour_created_at,
    v.user_id,
    u.username AS username,
    u.image AS userImage,
    (SELECT COUNT(*) FROM like_pic lv WHERE lv.pic_tours_id = v.id) AS like_count,
    (SELECT COUNT(*) FROM pic_comment c WHERE c.pic_tours_id = v.id) AS comment_count,
    (SELECT COUNT(*) FROM viewed_pic vv WHERE vv.pic_tours_id = v.id) AS view_count
    FROM pic_tours v
    JOIN users u ON v.user_id = u.id
    LEFT JOIN like_pic lv ON v.id = lv.pic_tours_id
    LEFT JOIN viewed_pic vv ON v.id = vv.pic_tours_id
    LEFT JOIN pic_comment c ON v.id = c.pic_tours_id
    WHERE v.pic_category = $1 AND u.is_deleted=FALSE
    GROUP BY v.id, u.username, u.image
    ORDER BY  view_count DESC,v.created_at DESC
    LIMIT $2 OFFSET $3;
    
       `;

    const { rows } = await pool.query(query, [id, perPage, offset]);

    return res
      .status(200)
      .json({ statusCode: 200, totalPages, totalTours, Tours: rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const getComentedTours = async (req, res) => {
  try {
    const { id } = req.params;
    const checkQuery =
    "SELECT * FROM pic_category WHERE id = $1";
  const checkResult = await pool.query(checkQuery, [id]);

  if (checkResult.rowCount === 0) {
    return res
      .status(404)
      .json({ statusCode: 404, message: "pic Category not exist" });
  }
    const page = parseInt(req.query.page || 1); // Get the page number from the query parameters
    const perPage = parseInt(req.query.limit || 10); // Number of results per page

    const offset = (page - 1) * perPage;

    const countQuery = `SELECT COUNT(*) FROM pic_tours  JOIN users u ON pic_tours.user_id = u.id
    
    WHERE pic_category=$1 AND u.is_deleted=FALSE;`;
    const countResult = await pool.query(countQuery, [id]);
    const totalTours = parseInt(countResult.rows[0].count);

    const totalPages = Math.ceil(totalTours / perPage);
    const query = `SELECT
    v.id AS pic_tour_id,
    v.name,
    v.description,
    v.pic_category,
    v.image,
    v.created_at AS tour_created_at,
    v.user_id,
    u.username AS username,
    u.image AS userImage,
      COUNT(c.id) AS comment_count
  FROM pic_tours v
  JOIN users u ON v.user_id = u.id
  LEFT JOIN pic_comment c ON v.id = c.pic_tours_id
  WHERE v.pic_category = $1 AND u.is_deleted=FALSE
  GROUP BY v.id, u.username, u.image
  ORDER BY comment_count DESC
  LIMIT $2 OFFSET $3;
  
       `;

    const { rows } = await pool.query(query, [id, perPage, offset]);

    return res
      .status(200)
      .json({ statusCode: 200, totalPages, totalTours, Tours: rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const viewTour = async (req, res) => {
  try {
    const { pic_tours_id, user_id } = req.body;
    // Check if the user has already viewed the video
    const checkQuery =
      "SELECT * FROM viewed_pic WHERE pic_tours_id = $1 AND user_id = $2";
    const checkResult = await pool.query(checkQuery, [pic_tours_id, user_id]);

    if (checkResult.rowCount > 0) {
      // The user has already viewed the video, return an error
      return res
        .status(200)
        .json({ statusCode: 200, message: "User has already view the tours" });
    }
    const createQuery =
      "INSERT INTO viewed_pic (pic_tours_id,user_id) VALUES($1,$2) RETURNING *";
    const result = await pool.query(createQuery, [pic_tours_id, user_id]);
    if (result.rowCount === 1) {
      return res.status(201).json({
        statusCode: 201,
        message: "Tours view successfully",
        data: result.rows[0],
      });
    }
    res.status(400).json({ statusCode: 400, message: "Not uploaded" });
  } catch (error) {
    console.error(error);
    if (error.constraint === 'viewed_pic_pic_tours_id_fkey') {
      return res.status(400).json({ statusCode: 400, message: "Pic tour does not exist" });
    } else if (error.constraint === 'viewed_pic_user_id_fkey') {
      return res.status(400).json({ statusCode: 400, message: " user does not exist" });
    }
    res.status(500).json({ statusCode: 500, message: "Internal server error" });
  }
};
export const searchTour = async (req, res) => {
  try {
    const { name } = req.query;

    // Split the search query into individual words
    const searchWords = name.split(/\s+/).filter(Boolean);

    if (searchWords.length === 0) {
      return res.status(200).json({ statusCode: 200, Suppliers: [] });
    }

    // Create an array of conditions for each search word
    const conditions = searchWords.map((word) => {
      return `(name ILIKE '%${word}%' OR description ILIKE '%${word}%')`;
    });

    const query = `SELECT
    v.id AS pic_tour_id,
    v.name,
    v.description,
    v.pic_category,
    v.image,
    v.created_at AS tour_created_at,
    v.user_id,
    u.username AS username,
    u.image AS userImage
        FROM pic_tours v
        JOIN users u ON v.user_id = u.id
        WHERE ${conditions.join(" OR ")} AND u.is_deleted=FALSE
        ORDER BY v.created_at DESC
        `;

    const { rows } = await pool.query(query);

    return res.status(200).json({
      statusCode: 200,
      totalTours: rows.length,
      Tours: rows,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
