export function prepareInstagramUser(instagramResult) {

    const user = {
        "instagramId": instagramResult.user.id,
        "username": instagramResult.user.username,
        "bio": instagramResult.user.bio,
        "website": instagramResult.user.website,
        "profilePicture": instagramResult.user.profile_picture,
        "fullName": instagramResult.user.full_name,
        "accessToken": instagramResult.access_token
    };

    return user;

}
