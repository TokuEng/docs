# Toku: ADP Stablecoin Payroll Integration Guide

This is a complete guide for setting up your Stablecoin Payroll in ADP

These steps are required to establish the initial connection to Toku.

- Setup required on ADP portal
    1. Login **to [https://api-central.adp.com/](https://api-central.adp.com/)** and go to Projects
    2. Click on “Create a project”
        
        ![](image24.png)
        
    3. Add Project name of your choice.
        
        ![](image13.png)
        
    4. Select: **Employee Demographic Data (Read/Write)**
        
        ![](image20.png)
        
    5. Once the project is created, you will find the client id and client secret in the project:
        
        ![](image3.png)
        
    6. Click on “View APIs” in Step 3
        
        ![](image5.png)
        
    7. Click “Add more apis”
        
        ![](image16.png)
        
    8. Add the following APIs 
        1. 
        
        ![](image27.png)
        
    9. Once all the relevant api’s are added, hit “Commit Changes”:
        
        Mandatory APIs required:
        
        - GET /hr/v2/workers
        - GET /events/payroll/v1/pay-data-input.modify/meta
        - POST /events/payroll/v1/pay-data-input.modify
        - POST /auth/oauth2/token
        
        ![](image25.png)
        
    10. Under Step 1 Click, “Manage Certificate”:
        
        ![](image18.png)
        
    11. Click on “Request Certificate”:
        
        ![](image26.png)
        
    12. Click Next on the following Screen:
        
        ![](image17.png)
        
    13. Input the following details to generate the private key
        1. Name your certificate (e.g. My Mutual SSL): Toku
        2. Organization name: Pre-populated
        3. Organization unit name (e.g. HR, IT, etc.): Payroll
        4. Country: United States
        5. State: New York
        6. Locality: New York
            
            ![Screenshot 2025-12-17 at 5.43.34 PM.png](Screenshot_2025-12-17_at_5.43.34_PM.png)
            
    14. Copy the Private Key generated on this step and save it somewhere secure to later add it to Toku, and hit next:
        
        ![Screenshot 2025-12-17 at 5.44.20 PM.png](Screenshot_2025-12-17_at_5.44.20_PM.png)
        
    15. Click on “Done”:
        
        ![Screenshot 2025-12-17 at 5.46.45 PM.png](Screenshot_2025-12-17_at_5.46.45_PM.png)
        
    16. Click On “Certificate” then select the dropdown of the certificate you created above named “Toku” then click “View”.
    
    ![Screenshot 2025-12-17 at 5.52.44 PM.png](Screenshot_2025-12-17_at_5.52.44_PM.png)
    
    1. Copy the Certificate and save to be pasted into Toku:
    
    ![Screenshot 2025-12-17 at 5.53.40 PM.png](Screenshot_2025-12-17_at_5.53.40_PM.png)
    

### **One time set up:**

- Permission access configuration
    1. Go to [https://workforcenow.cloud.adp.com/](https://workforcenow.cloud.adp.com/) , and click on setup:
        
        ![](image11.png)
        
    2. Click on “Access Permission”:
        
        ![](image6.png)
        
    3. Click on “Manage Profiles”
        
        ![](image10.png)
        
    4. Select the Project we just created in “API Central” from Step 3:
        
        ![](image4.png)
        
    5. Select “Process”
        
        ![Screenshot 2025-12-17 at 5.59.11 PM.png](Screenshot_2025-12-17_at_5.59.11_PM.png)
        
    6. Enable the following toggles, on each tab and hit “Save”:
        1. Additional Services
        2. General Ledger
        3. Payroll
        4. Workflow Administrator
        5. Benefits
        6. HR
        7. Talent
            
            ![Screenshot 2025-12-17 at 6.01.48 PM.png](Screenshot_2025-12-17_at_6.01.48_PM.png)
            
    7. Select “Reports & Analytics”
        1. Enable the following toggles, on each tab and hit “Save”:
            1. Custom Reports
            2. My Reports
            3. Standard Reports
            4. View
            5. Analytics
            6. General Ledger
            7. Reports Dashboard
            8. Tax & Reporting
            9. iReports
        
        ![](image2.png)
        
    8. Select “Setup”
        1. Enable the following toggles, on each tab and hit “Save”:
            1. Approval Process
            2. General Ledger
            3. Manage Documents
            4. Mobile
            5. Security
            6. Benefits
            7. HR & Talent
            8. Manage Partners
            9. Payroll
            10. Template Management
            11. Tools
            
            ![](image1.png)
            
    9. Select “People”
        1. Enable the following toggles, on each tab and hit “Save”:
            1. Benefits
            2. Pay
            3. Time & Attendance
            4. Employment
            5. Personal Information
        
        ![](image8.png)
        
- Create Post-Tax Net Deduction
    1. Go to [https://workforcenow.cloud.adp.com/](https://workforcenow.cloud.adp.com/) , and click on Setup > Payroll > Policy Manager
        
        ![Screenshot 2025-12-03 at 2.02.33 PM.png](Screenshot_2025-12-03_at_2.02.33_PM.png)
        
    2. Click Set Up New
        
        ![Screenshot 2025-12-03 at 2.03.47 PM.png](Screenshot_2025-12-03_at_2.03.47_PM.png)
        
    3. Select the radio button for Voluntary Benefit > Continue
        
        ![Screenshot 2025-12-03 at 2.04.53 PM.png](Screenshot_2025-12-03_at_2.04.53_PM.png)
        
    4. Enter the policy info as shown here, and select relevant pay groups, and for "how is this policy processed" select policy be processed **in every pay period.** This will ensure the codes are set up correctly, and that its applicable to the correct groups, and that it's applicable for all pay periods.
        1. Policy Name: “Token Deduction”
        2. Short Name: “Token Deduction”
        3. Policy ID: “TokenDeduc”
        4. Pay Statement Label
            1. Turn off toggle “Use default pay statement label”
            2. Voluntary Benefit (Post-Tax): “Token Deduction”
                
                ![Screenshot 2025-12-03 at 2.22.21 PM.png](Screenshot_2025-12-03_at_2.22.21_PM.png)
                
        5. How would you describe this plan? 
            1. Other
            2. Please Specify: “Post-Tax Token Deduction”
            3. Is this policy managed by ADP Workforce Now Benefits? “No”
                
                ![Screenshot 2025-12-03 at 2.26.00 PM.png](Screenshot_2025-12-03_at_2.26.00_PM.png)
                
        6. Pay Groups
            1. Select the applicable pay groups for your business
        7. How is this policy processed
            1. select “In every pay period”
                
                ![Screenshot 2025-12-03 at 2.27.11 PM.png](Screenshot_2025-12-03_at_2.27.11_PM.png)
                
            2. Select “Submit”
    
- Setup on Toku platform
    1. Go to Toku, and Under Token Payroll -> Settings -> Payroll Platforms -> Click “Add New Integration” -> Click “ADP”
        
        ![](image22.png)
        
        ![](image12.png)
        
    2. Add Details from:
        
        Step #5: Client ID, Client Secret,
        
        Step #14: Private Key,
        
        Step #16: PEM File Content
        
        To the following modal form, and hit “Connect ADP”
        
        ![](image14.png)
        

### Pointers on position ID and external employee ID in ADP

- Pointers
    - In payroll register, there is always position ID field for the employees in the register
    - In employees sync - we get both position ID & external employee ID for the employees
    - In order to post deductions we need - external employee ID & position ID

### Reoccurring Payroll Process

- Employee and Payroll sync process
    - Sync employees from Toku platform from employee management
    - Sync payrolls:
        - Screens for walkthrough:
            1. Export Payroll Register from ADP
                
                ![Screenshot 2025-12-18 at 10.02.13 AM.png](Screenshot_2025-12-18_at_10.02.13_AM.png)
                
            2. Select View Payroll
                
                ![Screenshot 2025-12-18 at 10.06.12 AM.png](Screenshot_2025-12-18_at_10.06.12_AM.png)
                
            3. Select Reports → Payroll History
                
                ![Screenshot 2025-12-18 at 8.54.34 AM.png](Screenshot_2025-12-18_at_8.54.34_AM.png)
                
            4. Select Sync Now
                
                ![Screenshot 2025-12-18 at 8.55.57 AM.png](Screenshot_2025-12-18_at_8.55.57_AM.png)
                
            5. Select Dashboard → Upload Data Next to your upcoming payroll
                
                ![Screenshot 2025-12-18 at 8.56.44 AM.png](Screenshot_2025-12-18_at_8.56.44_AM.png)
                

### Troubleshooting

- Raise ticket to ADP for approval
    
    Finally Email / Create support ticket in ADP from this link: [https://clientsupport.adp.com/hc/en-us/signin?return_to=https%3A%2F%2Fclientsupport.adp.com%2Fhc%2Fen-us%2Frequests%2F580069](https://clientsupport.adp.com/hc/en-us/signin?return_to=https%3A%2F%2Fclientsupport.adp.com%2Fhc%2Fen-us%2Frequests%2F580069) to provide access to The API endpoint for "payroll-output" can be found here: [https://developers.adp.com/guides/api-guides/payroll-output-api-guide-turbo-api-for-midsized-to-enterprise-businesses](https://developers.adp.com/guides/api-guides/payroll-output-api-guide-turbo-api-for-midsized-to-enterprise-businesses)
    
    1. This is only accessible by logged in users
    2. Once the Email is sent to ADP Support, they will send an email for an approval from the ADP Admin.
    3. ADP Admin of the account has to reply with something like “Yes, Please approve the required access”, they will provide access to the payroll data endpoints.
    4. After the all the above steps are completed, Data will start flowing to TOKU from ADP

CONFIDENTIALITY NOTICE: resource and any attachments are only for the use of the intended recipient and may contain information that is privileged, confidential or exempt from disclosure under applicable law. If you are not the intended recipient, any disclosure, distribution or other use of this resource or attachments is prohibited. If you have received this resource in error, please delete and notify the sender immediately. Thank you.