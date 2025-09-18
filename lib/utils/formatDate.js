const pad = (arg) => {
    return String(arg).padStart(2, "0");
};
const formatDate = (timestamp, type = "unix") => {
    switch (type) {
        case "unix":
            const date = new Date(timestamp * 1000);
            const day = date.getDate();
            const month = new Date(0, date.getMonth()).toLocaleString("en", {
                month: "short",
            });
            const year = date.getFullYear();
            return `${month} ${day}, ${year}x`;
        case "duration":
            const days = Math.floor(timestamp / 3600 / 24);
            const hours = Math.floor((timestamp % 86400) / 3600);
            const mins = Math.floor((timestamp % 3600) / 60);
            const secs = timestamp % 60;
            return `${pad(days)}:${pad(hours)}:${pad(mins)}:${pad(secs)}`;
        default:
            console.error(`"${type}" is not a valid type for timestamp`);
            return "0";
    }
};
export default formatDate;
