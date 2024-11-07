import {
  CompetitionCustomOptionalDefaults,
  EvaluationFuncEnum,
  ProblemEnum,
} from "./competition"

/**
 * I wanna write source code using zod default parameters, zod-prisma-types doesn't generate zod default parameters.
 * I dont't know how to generate...
 */
export const createCompetitionDefaultValue = {
  description: `
# This is description template

## Introduction

A data science competition is an event where enthusiasts and professionals in data science can compete to showcase their skills in data analysis and machine learning.

These competitions provide real-world business problems along with datasets, allowing participants to build, evaluate, and optimize models to solve these issues, thus enhancing their technical abilities.

Markdown allows us to organize and detail the competition rules, schedule, and other information effectively.

## Purpose of the Competition

The primary objectives of a data science competition are:

- **Skill Improvement**: Participants can enhance their data science and machine learning skills by solving real-world problems.
- **Networking**: It provides an opportunity to interact with other participants and experts who share similar interests.
- **Practical Experience**: Apply learned theories to real problems and gain practical experience.
- **Evaluation and Feedback**: Assess your skills and receive feedback from other participants.

## Rules Explanation

Here are some general rules for data science competitions:

1. **Submission Limit**: There is a limit to the number of submissions per day, usually around five.
2. **Evaluation Criteria**: Evaluation is based on specific metrics (e.g., RMSE, AUC). If a required metric does not exist in this open-source software (OSS), please commit directly to the OSS and create a pull request (PR).
3. **Team Participation**: You can participate individually or as part of a team.

## Markdown
you can write text in Markdown format.

inline: \`const example = 'This is inline code';\`


block:
\`\`\`python
hoge = 1
huga = 1
print(hoge + huga)
\`\`\`


## Schedule

The competition schedule is as follows:

- **Registration Opens**: October 1, 2024
- **Model Submission Deadline**: December 10, 2024
- **Results Announcement**: December 10, 2024


## Conclusion

A data science competition is an excellent opportunity for skill enhancement, networking, and gaining practical experience. Participants can learn a lot by building their models using the provided datasets and competing with others. We encourage you to take advantage of this opportunity to test your data science skills.

We look forward to your participation!
    `,
  dataDescription: `
# Description of Data Required for the Data Competition

To participate in the data competition, it is essential to understand and effectively utilize the provided dataset.

This section will provide detailed explanations of the data files and their columns.

## Files

The data competition primarily provides the following two files:

1. **train.csv**: This file contains the data used for training the model. It includes both features and the target variable.
2. **test.csv**: This file contains the data used for evaluating the model. It only includes features, and the target variable is not provided. Participants will make predictions on this data and submit their results.

## Columns

Each file contains the following columns:

### train.csv,test.csv

- **id**: A unique identifier for each data point.
- **feature_1, feature_2, ..., feature_n**: Features used for training the model. These columns represent various characteristics or attributes of the data points. The specific content of the features varies by competition but generally includes numerical and categorical data.
- **target**: The target variable to be predicted by the model. This column is used as the ground truth when training the model.


## Data Examples

Below are examples of the data in each file.

### Example of train.csv

| id  | feature_1 | feature_2 | feature_3 | ... | target |
|-----|-----------|-----------|-----------|-----|--------|
| 1   | 5.1       | 3.5       | 1.4       | ... | 0      |
| 2   | 4.9       | 3.0       | 1.4       | ... | 0      |
| 3   | 4.7       | 3.2       | 1.3       | ... | 0      |
| ... | ...       | ...       | ...       | ... | ...    |

### Example of test.csv

| id  | feature_1 | feature_2 | feature_3 | ... |
|-----|-----------|-----------|-----------|-----|
| 101 | 6.3       | 3.3       | 6.0       | ... |
| 102 | 5.8       | 2.7       | 5.1       | ... |
| 103 | 7.1       | 3.0       | 5.9       | ... |
| ... | ...       | ...       | ...       | ... |
    `,
  startDate: new Date("2025-12-01"),
  endDate: new Date("2025-12-31"),
  open: false,
  completed: false,
  evaluationFunc: EvaluationFuncEnum.regression.rmse.value,
  problem: ProblemEnum.regression,
  limitSubmissionNum: 50,
}
