import mongoose from 'mongoose';

const bonusSheetSchema = mongoose.Schema({
  bonusSheetId: String,
  createDate: String,
  describe: String,
});

const BonusSheet = mongoose.model('BonusSheet', bonusSheetSchema);

export default BonusSheet;
