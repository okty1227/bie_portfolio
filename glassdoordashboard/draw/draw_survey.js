
const conf = {
    "state": [
        "Alabama",
        "Alaska",
        "Arizona",
        "Arkansas",
        "California",
        "Colorado",
        "Connecticut",
        "Delaware",
        "Florida",
        "Georgia",
        "Hawaii",
        "Idaho",
        "Illinois",
        "Indiana",
        "Iowa",
        "Kansas",
        "Kentucky",
        "Louisiana",
        "Maine",
        "Maryland",
        "Massachusetts",
        "Michigan",
        "Minnesota",
        "Mississippi",
        "Missouri",
        "Montana",
        "Nebraska",
        "Nevada",
        "New Hampshire",
        "New Jersey",
        "New Mexico",
        "New York",
        "North Carolina",
        "North Dakota",
        "Ohio",
        "Oklahoma",
        "Oregon",
        "Pennsylvania",
        "Rhode Island",
        "South Carolina",
        "South Dakota",
        "Tennessee",
        "Texas",
        "Utah",
        "Vermont",
        "Virginia",
        "Washington",
        "West Virginia",
        "Wisconsin",
        "Wyoming"
    ],
    "industriesSelectors": [
        {
            "id": "industry1",
            "value": "Information Technology",
            "checked": true
        },
        {
            "id": "industry2",
            "value": "Biotech & Pharmaceuticals",
            "checked": true
        },
        {
            "id": "industry3",
            "value": "Health Care",
            "checked": false
        },
        {
            "id": "industry4",
            "value": "Business Services",
            "checked": false
        },
        {
            "id": "industry5",
            "value": "Finance",
            "checked": false
        },
        {
            "id": "industry6",
            "value": "Other",
            "checked": false
        }
    ],
    "CompSize": [
        {
            "value": "Under 500",
            "nametag": "Under 500",
            "imgCount": 1
        },
        {
            "value": "500 to 1000",
            "nametag": "500 to 1000",
            "imgCount": 2
        },
        {
            "value": "1000 to 5000",
            "nametag": "1000 to 5000",
            "imgCount": 3
        },
        {
            "value": "More than 5000",
            "nametag": "More than 5000",
            "imgCount": 4
        }
    ],
    "SalarySize": [
        {
            "value": "lowestSalary",
            "id": "lowestSalary",
            "nametag": "Under 50k"
        },
        {
            "value": "lowSalary",
            "id": "lowSalary",
            "nametag": "50k to 90k"
        },
        {
            "value": "middleSalary",
            "id": "middleSalary",
            "nametag": "90k to 150k"
        },
        {
            "value": "highSalary",
            "id": "highSalary",
            "nametag": "150k to 250k"
        },
        {
            "value": "highestSalary",
            "id": "highestSalary",
            "nametag": "More than 250k"
        }
    ],
    "skillsSelectors": [
        {
            "id": "python",
            "value": "python",
            "nametag": "Python"
        },
        {
            "id": "r",
            "value": "r",
            "nametag": "R"
        },
        {
            "id": "spark",
            "value": "spark",
            "nametag": "Spark"
        },
        {
            "id": "aws",
            "value": "aws",
            "nametag": "AWS"
        },
        {
            "id": "excel",
            "value": "excel",
            "nametag": "Excel"
        }
    ]
}
const skillsSelectors = conf["skillsSelectors"];
const industriesSelectors = conf["industriesSelectors"];
const CompSize = conf["CompSize"];
const SalarySize = conf["SalarySize"];
const states = conf["state"];

// questionarire for skills

const skillsSelection = document.getElementById("Skills");
skillsSelectors.forEach((skill) => {
    const li = document.createElement("li");
    const label = document.createElement("label");
    label.htmlFor = skill.id;
    const input = document.createElement("input");

    input.type = "checkbox";
    input.id = skill.id;
    input.name = "skills";
    input.value = skill.value;
    input.checked = skill.checked;

    label.appendChild(input);
    label.appendChild(document.createTextNode(skill.value));

    li.appendChild(label);
    skillsSelection.append(li);
});

// questionaire for state selection
const statesSelection = document.getElementById("states");


states.forEach((state) => {
    const option = document.createElement("option");
    if (state === "California") {
        option.selected = true;
    }
    option.value = state;
    option.textContent = state;
    statesSelection.appendChild(option);
});


const industrySelection = document.getElementById("industryList");

industriesSelectors.forEach((industry) => {
    const li = document.createElement("li");
    const label = document.createElement("label");
    label.htmlFor = industry.id;
    const input = document.createElement("input");

    input.type = "checkbox";
    input.id = industry.id;
    input.name = "industries";
    input.value = industry.value;
    input.checked = industry.checked;

    label.appendChild(input);
    label.appendChild(document.createTextNode(industry.value));

    li.appendChild(label);
    industrySelection.append(li);
});

// questionaure for company size


const createCompanySizeOption = function (value, nametag, imgCount) {
    const li = document.createElement("li");
    const lable = document.createElement("lable");
    const input = document.createElement("input");

    input.name = "companySize";
    input.value = value;
    input.type = "radio";
    input.checked = value === "500 to 1000" ? true : false;

    for (let i = 1; i <= imgCount; i++) {
        const pplImg = document.createElement("img");
        pplImg.src = "data/people.svg";
        pplImg.alt = "pplSvg";
    }

    lable.appendChild(input);
    lable.appendChild(document.createTextNode(nametag));
    li.appendChild(lable);
    return li;
};

CompSizeContainer = document.getElementById("compSize");

for (let i = 0; i < CompSize.length; i++) {
    CompSizeContainer.append(
        createCompanySizeOption(
            CompSize[i].value,
            CompSize[i].nametag,
            CompSize[i].imgCount
        )
    );
}

// questionaire for salarySize


const createSalarySizeOption = function (value, nametag, id) {
    const li = document.createElement("li");
    const lable = document.createElement("lable");
    const input = document.createElement("input");

    input.name = "salary";
    input.value = value;
    input.type = "radio";
    input.id = id;
    input.checked = value === "middleSalary" ? true : false;

    lable.appendChild(input);
    lable.appendChild(document.createTextNode(nametag));
    li.appendChild(lable);
    return li;
};

const SalarySizeContainer = document.getElementById("SalarySize");

for (let i = 0; i < CompSize.length; i++) {
    SalarySizeContainer.append(
        createSalarySizeOption(
            SalarySize[i].value,
            SalarySize[i].nametag,
            SalarySize[i].id
        )
    );
}

