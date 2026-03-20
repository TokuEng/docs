# Toku: UKG Stablecoin Payroll Integration Guide

This is a complete step-by-step guide to integrate your UKG payroll with Toku.

### Toku Installation Instructions

Please follow these steps in order to establish the connection between UKG and Toku. Payroll runs will be created within Toku after the connection is established. 

Note: Employee data will only come through on the based on if an employee profile has been created through an HCM integration such as Workday, BambooHR, Oracle, ect.

1. Configure UKG
- **Locate API connection credentials**
    
    First you will need to locate your API credential to establish the connection to your UKG tenant. Follow the steps below to save locate the information needed, you can copy these as you will need these later:
    
    Navigate to **Security > Web Services**.
    
    - **User API key**
    - **Customer API key**
    - **Tenant ID**
    - Any one of the **service endpoint** URLs such as:
        - “Employee contacts service endpoint”
        - “Employee person service endpoint”
    
    ![Screenshot 2025-10-30 at 7.48.33 PM.png](d6d1c4d0-29e9-4553-a043-ba744bb904f9.png)
    
- **Adding a new service account**
    
    A service account is an account through which our Toku will be performing actions via external API. This allows you to ensure only the necessary information is being sent to Toku to perform Stablecoin payroll.
    
    1. Go to **Security > Service Account Administration**. 
    
    ![Screenshot 2025-10-30 at 8.07.28 PM.png](Screenshot_2025-10-30_at_8.07.28_PM.png)
    
    1. Click on "Add" in the Service Account Administration page. 
    
    ![Screenshot 2025-10-30 at 8.08.56 PM.png](Screenshot_2025-10-30_at_8.08.56_PM.png)
    
    1. Create a user name and password. 
        1. Username: `TOKU_SYSTEM` 
        2. Email: dev@toku.com
        3. Password: (Generate new password)
    2. Select the following fields at the following configuration in the **Web Service** section.
        1. `Employee Compensation Details` - View
        2. `Employee Person Details` -  View 
        3. `Custom Integrations` - View and Edit 
        4. `Deduction integration` - View
        5. `Payroll integration` - Add, View and Edit 
        6. `Employee Export` - View
        7. `Employee employment information` - View
        8. `Employee compensation` - View and Edit
        9. `Company Configuration Integration` - View
        10. `Personnel Integration` - View
        
        ![Screenshot 2025-10-30 at 8.10.28 PM.png](Screenshot_2025-10-30_at_8.10.28_PM.png)
        
        *Note: The “view” fields are required for Toku to ensure we are able to match the employee on this payroll with the corresponding employee in your HCM system (Workday, BambooHR, Oracle, ect.)*
        
        *Note: The “edit” fields are required for Toku to insert Stablecoin deductions directly on upcoming payrolls for each employee.*
        
        **Make sure that you have a record of the following information:**
        
        - **User name: (from step 3)**
        - **Password: (from step 3)**
        - **User API Key: (to the right of the the newly created user)**
        - **Customer API Key: (at the top of Service Account Administration panel)**
        
- **Create a deduction plan**
    
    We will now create a custom post tax deduction that is exclusively used for these stablecoin deductions. This allows you to indicate clearly that this deduction is tied to the voluntary action the employee has taken within Toku.
    
    1. Go To **Business Rules**
    
    ![Screenshot 2025-10-30 at 8.28.29 PM.png](Screenshot_2025-10-30_at_8.28.29_PM.png)
    
    1. Search for “**deductions**” → Click on “**Deduction/Benefits Plans**”
        
        ![Screenshot 2025-11-17 at 6.59.15 AM.png](Screenshot_2025-11-17_at_6.59.15_AM.png)
        
    
    1. Add Deduction/Benefit Plan
        
        ![Screenshot 2025-11-17 at 7.00.27 AM.png](Screenshot_2025-11-17_at_7.00.27_AM.png)
        
    
    1. Select today as the effective date
    2. Add Details
        1. Description - Stablecoin Deduction
        2. Description Type - Other
        3. Tax Category - Voluntary Withholding
        4. Deduction start and stop dates
        5. Start - Today
        6. Enrollment Disclaimer - “This is the voluntary amount already paid in stablecoins through Toku.” Click Next (Top right corner)
            
            ![Screenshot 2025-11-17 at 6.57.48 AM.png](Screenshot_2025-11-17_at_6.57.48_AM.png)
            
    3. Click Next
    4. In the Calculations page - 
        1. Under Employee, select the “Use rate at employee level” checkbox
        2. In the “Amount” row for the “Calculation Rules” column -  there's a drop down. Select “Flat amount” 
        
        ![Screenshot 2025-11-17 at 7.31.30 PM.png](Screenshot_2025-11-17_at_7.31.30_PM.png)
        
        Click Next 
        
    5. Select the Paychecks per pay period, we want this deduction to be posted in the “**Scheduled Pay Periods by Default”.** Click Next.
    
    ![Screenshot 2025-11-17 at 8.20.00 PM.png](Screenshot_2025-11-17_at_8.20.00_PM.png)
    
    1. The review screen comes up, click “Save” 
        
        ![Screenshot 2025-11-17 at 8.22.33 PM.png](Screenshot_2025-11-17_at_8.22.33_PM.png)
        
- **Add Deduction plan to the required Deduction group**
    
    As part of this we need to add the deduction plan we created to the required deduction group.
    
    1. Go To **Business Rules**
    
    ![Screenshot 2025-10-30 at 8.28.29 PM.png](Screenshot_2025-10-30_at_8.28.29_PM.png)
    
    1. Search for “**deductions**” → Click on “**Deduction/Benefit Groups**”
    2.  Select the deduction group (Country) that we want to add a Deduction code to.
        
        ![Screenshot 2025-11-17 at 8.30.38 PM.png](Screenshot_2025-11-17_at_8.30.38_PM.png)
        
    3.  For the deduction group under the “**Plans**” table click “**Add**”
    
    ![Screenshot 2025-11-17 at 8.32.16 PM.png](Screenshot_2025-11-17_at_8.32.16_PM.png)
    
    1.  In the “**Add record**” pop up for the “**Deductions/Benefit Plan**” field click the drop down and select the SCDED deduction code which we created in the previous step. Click “Add”
        
        ![Screenshot 2025-11-17 at 8.34.13 PM.png](Screenshot_2025-11-17_at_8.34.13_PM.png)
        
    2. Save the changes to the deduction group

1. Establish UKG connection on the Toku Platform 
- **Adding the API connection and service account credentials on the Toku platform**
    
    
    1. Login into your Toku profile at [https://tga.toku.com/login?product=stablecoin_payroll](https://tga.toku.com/login?product=stablecoin_payroll) under the “Stablecoin payroll” tab
    
    ![Screenshot 2025-11-14 at 1.42.35 PM.png](Screenshot_2025-11-14_at_1.42.35_PM.png)
    
    1. Click on **Settings** in the left side navbar
    
    ![Screenshot 2025-11-14 at 2.12.39 PM.png](Screenshot_2025-11-14_at_2.12.39_PM.png)
    
    1. Click on **Payroll Integrations** Card 
    
    ![Screenshot 2025-11-14 at 2.14.30 PM.png](Screenshot_2025-11-14_at_2.14.30_PM.png)
    
    1.  Click on **Add New Integration** 
    
    ![Screenshot 2025-11-14 at 2.15.16 PM.png](Screenshot_2025-11-14_at_2.15.16_PM.png)
    
    1. click on the **UKG** card  in the Select integration pop-up
    
    ![Screenshot 2025-11-14 at 2.16.11 PM.png](Screenshot_2025-11-14_at_2.16.11_PM.png)
    
    1. It opens the **Integration purpose** pop-up which asks you whether this integration should be the source of growth for your employees sync. 
    
    ![Screenshot 2025-11-14 at 2.17.13 PM.png](Screenshot_2025-11-14_at_2.17.13_PM.png)
    
    *Note: Do not select the checkbox if you will be integrating and HCM where your employees are stored.*
    
    1.  Add the credentials and deduction to the form and click Save.
        1. The S**ervice Endpoint URL, Tenant ID, User API key, Customer API key** can be found in the [steps 1.1](https://www.notion.so/Toku-Stablecoin-Payroll-for-UKG-29c0b95a751d80ae98ade366642f460e?pvs=21) ([**1.1 - Finding your API connection credential**](https://www.notion.so/Toku-Stablecoin-Payroll-for-UKG-29c0b95a751d80ae98ade366642f460e?pvs=21)) of this guide.
        2. The **Service account user name and Service account password** can be found in the [steps 1.2 (**1.2 - Adding a new service account**](https://www.notion.so/Toku-Stablecoin-Payroll-for-UKG-29c0b95a751d80ae98ade366642f460e?pvs=21)) of this guide. 
        3. The **Deduction code** can be found in the [step 2.1 (**2.1 Adding a deduction group**)](https://www.notion.so/Toku-Stablecoin-Payroll-for-UKG-29c0b95a751d80ae98ade366642f460e?pvs=21) of this guide
    
    ![Screenshot 2025-11-14 at 2.18.03 PM.png](Screenshot_2025-11-14_at_2.18.03_PM.png)
    
    1. Select “Update UKG” to establish the connection
    
    You are all set! Your integration will now update once every 15 minutes to pull upcoming payrolls into Toku
    

CONFIDENTIALITY NOTICE: resource and any attachments are only for the use of the intended recipient and may contain information that is privileged, confidential or exempt from disclosure under applicable law. If you are not the intended recipient, any disclosure, distribution or other use of this resource or attachments is prohibited. If you have received this resource in error, please delete and notify the sender immediately. Thank you.