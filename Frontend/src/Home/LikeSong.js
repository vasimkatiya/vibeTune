

async function likeToggle(songId) {
    try {
        const res = await api.get(`/songs/like/${songId}`);
        console.log(res.data);
        successToast("Song liked successfully");
        return res.data;
  }
    catch (error) {
    console.log(error);
    errorToast(
      error.response?.data?.message || 
      error.message || 
      "Something went wrong"
    );
  }
}

export default likeToggle;