const BASE_URL_1 = "https://www.googleapis.com/youtube/v3";
const API_KEY_1 = "AIzaSyA6H2qKKWqHgEltuym61HAMLU-6R9gAuu8";

const currentVideo = document.getElementById("current-video");
const videoId = localStorage.getItem("videoId");
const publicComments = document.getElementById("public-comments");
const commentsCount = document.getElementById("comments-count");

const playingChannelName = document.getElementById("playing-channel-name");


// getting a single video details using videoId 
async function getVideoDetails1(){
    const url = `${BASE_URL_1}/videos?key=${API_KEY_1}&part=snippet,contentDetails,statistics&id=${videoId}`;
    const response = await fetch(url, {
        method:"get"
    });
    const data = await response.json();
    renderVideo(data.items[0]);
    loadComments();
    // return data.items[0];
    // console.log("data->", data);
    // console.log(data.items);
}

//play the current video
function renderVideo(video){
    currentVideo.innerHTML= ``;
    currentVideo.innerHTML = `
    <div class="yt-video">
                <div class="video-image">
                    <iframe src="https://www.youtube.com/embed/${videoId}" allowfullscreen></iframe>
                </div>
                <div class="video-details">
                    <div class="title"><p>${video.snippet.localized.title}</p></div>
                    <div class="details">
                        <div class="viewsAndDate">
                            <p>${formatViewCount(video.statistics.viewCount)} views . Oct 8, 2021</p>
                        </div>
                        <div class="buttons">
                            <div class="item">
                                <img src="assets/images/LikedBig.png" alt="">
                                <p>${formatViewCount(video.statistics.likeCount)}</p>
                            </div>
                            <div class="item">
                                <img src="assets/images/DisLikedBig.png" alt="">
                                <p>1.2K</p>
                            </div>
                            <div class="item">
                                <img src="assets/images/Share.png" alt="">
                                <p>SHARE</p>
                            </div>
                            <div class="item">
                                <img src="assets/images/Save.png" alt="">
                                <p>SAVE</p>
                            </div>
                            <div class="item">
                                <img src="assets/images/More.png" alt="">
                            </div>
                        </div>
                    </div>
                </div> 
                <hr>
                <div class="channel">
                    <div class="part-1">
                        <div class="channel-details">
                            <img src="assets/images/Channel-img.png" alt="">
                            <div class="details">
                                <p>${video.snippet.channelTitle}</p>
                                <p>1.2M subscribers</p>
                            </div>
                        </div>
                        <div class="button">
                            <button type="button">SUBSCRIBE</button>
                        </div>
                    </div>
                    <div class="part-2">
                        <p>${video.snippet.localized.description}</p>
                    </div>
                </div>
                <hr>     
            </div>`;

            commentsCount.innerText = `${formatViewCount(video.statistics.commentCount)}`;

            suggestionsContainer.innerHTML = `
            <div class="nav">
                <p>All</p>
                <p id="playing-channel-name">From ${video.snippet.channelTitle}</p>
            </div>`;
}

//get the comments of video
async function loadComments(){
    const url = `${BASE_URL_1}/commentThreads?key=${API_KEY_1}&part=snippet&videoId=${videoId}&maxResults=80&order=time`;
    const response = await fetch(url);
    const data = await response.json();
    const comments = data.items;
    console.log(comments);
    renderComments(comments);
}

//render the comments
function renderComments(comments){
    publicComments.innerHTML = '';
    comments.forEach((comment) => {
        publicComments.innerHTML += `
        <div class="comment">
                    <div class="account-img">
                        <img src="${comment.snippet.topLevelComment.snippet.authorProfileImageUrl}" alt="">
                    </div>
                    <div class="details">
                        <div class="name">${comment.snippet.topLevelComment.snippet.authorDisplayName} </div>
                        <div class="text">${comment.snippet.topLevelComment.snippet.textDisplay}</div>
                        <div class="buttons">
                            <img src="assets/images/LikedBig.png" alt="">
                            <img src="assets/images/DisLikedBig.png" alt="">
                        </div>
                    </div>
                </div>`;
    });

}


getVideoDetails1();

//suggestion videos

const suggestionsContainer = document.getElementById("suggestions-container");

// getting random videos (we get videos and their videoId from this output)
async function getVideos(q){
    const url = `${BASE_URL_1}/search?key=${API_KEY_1}&q=${q}&type=videos&maxResults=30`;
    const response = await fetch(url, {
        method:"get"
    });
    const data = await response.json();
    const videos = data.items;
    getVideoData(videos);
}

// getting a single video details using videoId 
async function getVideoDetails(videoId){
    const url = `${BASE_URL_1}/videos?key=${API_KEY_1}&part=snippet,contentDetails,statistics&id=${videoId}`;
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
    console.log(videoDataList);
    renderSuggestionVideos(videoDataList);
}

//render suggested videos
function renderSuggestionVideos(videos){
    for(let i=0;i<videos.length;i++){
        if(videos[i] == undefined) continue;
        const video = videos[i];
        const thumbnailUrl = video.snippet.thumbnails.medium.url;
        // const duration = video.contentDetails.duration;
        const videoTitle = video.snippet.localized.title;
        const channelName = video.snippet.channelTitle;
        let viewCount = video.statistics.viewCount;
        viewCount = formatViewCount(viewCount);

        suggestionsContainer.innerHTML += `
        <div class="suggested-video">
                <div class="video-image" onClick="openVideoDetails('${video.id}')">
                    <img src="${thumbnailUrl}" alt="video image">
                    <div class="duration">23.52</div>
                </div>
                <div class="description">
                    <p class="title">${videoTitle}</p>
                    <p class="channel-name">${channelName}</p>
                    <div class="viewsAndTime">
                        <p class="views">${viewCount} views .</p>
                        <p class="time"> 5 days ago</p>
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