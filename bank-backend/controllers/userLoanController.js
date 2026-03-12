import Loan from "../models/Loan.js";
import User from "../models/User.js";

export const getMyLoans = async (req, res) => {
  try {
    const loans = await Loan.find({
      userObjectId: req.user._id,
      $or: [
        { isArchived: false },
        { isArchived: { $exists: false } },
      ],
    })
      .select("loanId status loanDetails createdAt remarks")
      .sort({ createdAt: -1 });

    res.status(200).json(loans);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


export const getMyLoanDetails = async (req, res) => {
  try {
    const loan = await Loan.findOne({
      loanId: req.params.loanId,
      userObjectId: req.user._id,
      $or: [
        { isArchived: false },
        { isArchived: { $exists: false } },
      ],
    });

    if (!loan) {
      return res.status(404).json({ message: "Loan not found" });
    }

    res.status(200).json(loan);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


export const getUserDocuments = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("documents");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      documents: {
        panCard: user.documents?.panCard?.url ? user.documents.panCard : null,
        aadharCard: user.documents?.aadharCard?.url ? user.documents.aadharCard : null,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const uploadPanCard = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "PAN card file is required" });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.documents = user.documents || {};
    user.documents.panCard = {
      url: req.file.path.replace(/\\/g, "/"),
      filename: req.file.originalname,
      uploadedAt: new Date(),
    };

    await user.save();

    res.status(200).json({
      message: "PAN card uploaded successfully",
      document: user.documents.panCard,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const uploadAadharCard = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Aadhar card file is required" });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.documents = user.documents || {};
    user.documents.aadharCard = {
      url: req.file.path.replace(/\\/g, "/"),
      filename: req.file.originalname,
      uploadedAt: new Date(),
    };

    await user.save();

    res.status(200).json({
      message: "Aadhar card uploaded successfully",
      document: user.documents.aadharCard,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
export const updateMyLoan = async (req, res) => {
  try {
    const loan = await Loan.findOne({
      loanId: req.params.loanId,
      userObjectId: req.user._id,
      $or: [{ isArchived: false }, { isArchived: { $exists: false } }],
    });

    if (!loan) {
      return res.status(404).json({ message: "Loan not found" });
    }

    if (!["draft", "pending"].includes(loan.status)) {
      return res.status(400).json({
        message: "Only draft or pending loans can be edited",
      });
    }

    const {
      loanType,
      loanAmount,
      companyId,
      companyName,
      location,
      salary,
      netHandSalary,
      panNumber,
      aadhaarNumber,
      address,
    } = req.body || {};

    const files = req.files || {};

    loan.loanDetails = {
  ...loan.loanDetails,
  loanType,
  amount: Number(loanAmount),
};

loan.employmentDetails = {
  ...loan.employmentDetails,
  companyId,
  companyName,
  location,
  salary: Number(salary),
  netHandSalary: Number(netHandSalary),
};

const updatedKycDetails = {
  ...loan.kycDetails,
  panNumber,
  aadharNumber: aadhaarNumber,
  address,
};

if (files.panFile?.[0]) {
  updatedKycDetails.panFile = files.panFile[0].path.replace(/\\/g, "/");
}

if (files.aadhaarFile?.[0]) {
  updatedKycDetails.aadhaarFile = files.aadhaarFile[0].path.replace(/\\/g, "/");
}

if (files.bankStatements?.length) {
  updatedKycDetails.bankStatements = files.bankStatements.map((file) =>
    file.path.replace(/\\/g, "/")
  );
}

if (files.itReturns?.length) {
  updatedKycDetails.itReturns = files.itReturns.map((file) =>
    file.path.replace(/\\/g, "/")
  );
}

if (files.payslips?.length) {
  updatedKycDetails.payslips = files.payslips.map((file) =>
    file.path.replace(/\\/g, "/")
  );
}

loan.kycDetails = updatedKycDetails;

loan.markModified("loanDetails");
loan.markModified("employmentDetails");
loan.markModified("kycDetails");

await loan.save();

    await loan.save();

    const user = await User.findById(req.user._id);

    if (user) {
      if (panNumber) user.panNumber = panNumber;
      if (aadhaarNumber) user.aadharNumber = aadhaarNumber;
      if (address) user.address = address;

      user.documents = user.documents || {};

      if (files.panFile?.[0]) {
        user.documents.panCard = {
          url: files.panFile[0].path.replace(/\\/g, "/"),
          filename: files.panFile[0].originalname,
          uploadedAt: new Date(),
        };
      }

      if (files.aadhaarFile?.[0]) {
        user.documents.aadharCard = {
          url: files.aadhaarFile[0].path.replace(/\\/g, "/"),
          filename: files.aadhaarFile[0].originalname,
          uploadedAt: new Date(),
        };
      }

      await user.save();
    }

    res.status(200).json({
      message: "Loan updated successfully",
      loan,
    });
  } catch (error) {
    console.error("Update my loan error:", error);
    res.status(500).json({ message: "Server error" });
  }
};