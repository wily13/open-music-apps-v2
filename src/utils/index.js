const mapDBToModel =
    ({
         id,
         title,
         year,
         performer,
         genre,
         duration,
         inserted_at,
         updated_at,
     }) => ({
        id,
        title,
        year: parseInt(year),
        performer,
        genre,
        duration: parseInt(duration),
        insertedAt: inserted_at,
        updatedAt: updated_at,
    });

const getSongAllmapDBToModel =
    ({
         id,
         title,
         performer
     }) => ({
        id,
        title,
        performer
    });

module.exports = {mapDBToModel,getSongAllmapDBToModel};
