class User {
    constructor(id, name, avatar, age, gender, tags, school, about, pics, minRent, maxRent) {
        this.id = id;
        this.name = name;
        this.avatar = avatar;
        this.age = age;
        this.gender = gender;
        this.school = school;
        this.about = about;
        this.pics = pics;
        this.minRent = minRent;
        this.maxRent = maxRent;
        this.tags = tags;
    }
}

export default User;