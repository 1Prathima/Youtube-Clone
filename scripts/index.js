const BASE_URL = "https://www.googleapis.com/youtube/v3";
// const API_KEY = "AIzaSyAheaVrdYahSSvwgwSlQbTg6wKvS_wpgsU";
// const API_KEY = "AIzaSyBChNXVQQitelesdME3RL7X3fLWuKBISgg";
// const API_KEY = "AIzaSyA6H2qKKWqHgEltuym61HAMLU-6R9gAuu8";
const API_KEY = "AIzaSyCX9hUGvoRTlZ0AiBPaNb7l5ZoBDZfFLpE";
const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");

const videosContainer = document.getElementById("videos-container");

// getting random videos (we get videos and their videoId from this output)
async function getVideos(q){
    const url = `${BASE_URL}/search?key=${API_KEY}&q=${q}&part=snippet&type=videos&maxResults=21`;
    const response = await fetch(url, {
        method:"get"
    });
    const data = await response.json();
    const videos = data.items;
    console.log("videos Data->", data.items);
    getVideoData(videos);
}

// getting a single video details using videoId 
async function getVideoDetails(videoId){
    const url = `${BASE_URL}/videos?key=${API_KEY}&part=snippet,contentDetails,statistics&id=${videoId}`;
    const response = await fetch(url, {
        method:"get"
    });
    const data = await response.json();
    return data.items[0];
    // console.log("data->", data);
    // console.log(data.items);
}

// iterating over each video of videos array got from getVideos() and sending videoId to get the data of each video
async function getVideoData(videos){
    const videoDataList = [];
    for(let i=0;i<videos.length;i++){
        const video = videos[i];
        const videoId = video.id.videoId;
        videoDataList.push(await getVideoDetails(videoId));
    }
    console.log("each video data list->",videoDataList);
    renderVideos(videoDataList);
}


function renderVideos(videos){
    videosContainer.innerHTML = ``;
    for(let i=0;i<videos.length;i++){
        if(videos[i] == undefined) continue;
        const video = videos[i];
        const thumbnailUrl = video.snippet.thumbnails.high.url;
        // let duration = video.contentDetails.duration;
        const videoTitle = video.snippet.localized.title;
        const channelName = video.snippet.channelTitle;
        let viewCount = video.statistics.viewCount;
        viewCount = formatViewCount(viewCount);
        let publishedTime = video.snippet.localized.publishedAt;
        // publishedTime = formatTimeAgo("publishedTime");


        videosContainer.innerHTML += `
        <div class="video-details">
                <div class="video-image" onClick="openVideoDetails('${video.id}')">
                    <img src="${thumbnailUrl}" alt="video image">
                    <div class="duration">23:52</div>
                </div>
                <div class="video-description">
                    <div class="channel-image">
                        <img src="assets/images/User-Avatar1.png" alt="">
                    </div>
                    <div class="details">
                        <p class="title">${videoTitle}</p>
                        <p class="channel-name">${channelName}</p>
                        <div class="viewsAndTime">
                            <p class="views">${viewCount} views .</p>
                            <p class="time">5 days ago</p>
                        </div>
                    </div>
                </div>
            </div>`;
    }
}

function openVideoDetails(videoId){
    localStorage.setItem("videoId", videoId);
    window.open("/videoDetails.html");
}

getVideos("");


//searching functionality

searchButton.addEventListener("click",()=>{
    console.log(searchInput.value);
    getVideos(searchInput.value);
})


//formatting numbers
function formatViewCount(viewCount) {
    if (viewCount >= 1000000000) {
        return (viewCount / 1000000000).toFixed(0) + 'B';
    } else if (viewCount >= 1000000) {
        return (viewCount / 1000000).toFixed(0) + 'M';
    } else if (viewCount >= 1000) {
        return (viewCount / 1000).toFixed(0) + 'K';
    } else {
        return viewCount.toString();
    }
}






