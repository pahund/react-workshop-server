const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const data = require("../data/forum.json");
const router = express.Router();

const app = express();
const port = process.env.PORT || 8080;

const monthNames = [
    "Januar", "Februar", "März", "April", "Mai", "Juni",
    "Juli", "August", "September", "Oktober", "November", "Dezember"
];

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

function getTopicById(id) {
    return data.topics.filter(topic => topic.id == id)[0];
}

function leftPad(number) {
    return ("00" + number).slice(-2);
}

function getDate() {
    const date = new Date();
    return `${date.getDate()} ${monthNames[date.getMonth()]} ${leftPad(date.getHours())}:${leftPad(date.getMinutes())}`;
}

router.get("/", (req, res) => res.json({ message: "Welcome to our API!" }));
router.route("/topics").get((req, res) => res.json(data.topics));
router.route("/topics/:topicId")
    .get((req, res) => res.json(getTopicById(req.params.topicId)))
    .post(req => {
        console.log("received POST data: ", req.body);
        data.topics = data.topics.map(topic => {
            if (topic.id != req.params.topicId) {
                return topic;
            }
            topic.posts.push({
                message: req.body.message,
                date: getDate(),
                poster: {
                    name: req.body.userName,
                    id: req.body.userId
                }
            });
            return topic;
        });
    });

app.use("/api/", router);

app.listen(port);

console.log(`API is running smoothly on port ${port}`);
