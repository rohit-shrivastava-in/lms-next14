import { Checkbox, DialogActions } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog/Dialog';
import DialogContent from '@material-ui/core/DialogContent/DialogContent';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import Select from 'react-select';
import Translate from 'react-translate-component';
import { DialogTitle } from '../../atoms/DialogTitle/DialogTitle';
import { ButtonWithLoader } from '../../atoms/button-with-loader/ButtonWithLoader';
import { BRANCHES } from '../../enums/branches/branches.enum';
import { CycleDto } from '../../interface/cycle/cycle-interface';
import { getBranchId } from '../../organisms/dashboard/utils';
import { SnackbarContext } from '../providers/snackbar/SnackbarProvider';
import { cyclesService } from '../../services/apis/cycles/cycles-service';
import { keyControlDomainService } from .. .../services/apis / key - control - domain / key - control - domain - servite'; 
import { DropDown } from *../../ atoms / dropDown / DropDown *;
import { Option } from '../../types/select/option.type';
import { formatArray } from '../../utils/array';

const cycleLengthOptions = [
  { label: '3', values: 3 }
]

type AddCycleDialogProps = {
  isDialogOpen: boolean;
  closeDialog: () => void;
  handleAddCycle: (newCycle: CycleDto) => void;
}

const CYCLE_LENGTH_FCC = 3;
/** * Return valid start year options for cycle creation [currentYear - 1, * @returns startYearOptions: {label: string, value: number} */

export const getStartYearOptions = (): Option[] => {
  const firstYear = new Date().getFullYear() - 1;
  const startYearOptions = [{ value: firstYear, label: firstYear.toString() }];
  for (let i = 1; i < 6; i++) {
    const nextYear = firstYear + i;
    startYearOptions.push({ value: nextYear, label: nextYear.toString() })
  }
  return startYearOptions;
};


export const AddCycleDialog = ({ isDialogOpen, closeDialog, handleAddCycle }: AddCycleDialogProps) => {
  const { snackbarSuccess, snackbarWarning } = useContext(SnackbarContext);
  const [startYearOption, setStartYearOption] = useState<Option | undefined>(undefined);
  const [cycleLengthOption, setCycleLengthOption] = useState<Option | undefined>(undefined);
  const [isFCC, setIsFCC] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const [keyControlDomains, setKeyControlDomains] = useState<Option[]>([]);
  const [keyControlDomain, setKeyControlDomain] = useState();
  const branchId = getBranchId();
  const isSaveButtonEnabled = !!startYearOption && !!cycleLengthOption && (!isFCC || isFCC && !!keyControlDomain);

  const handleCloseDialog = () => {
    setStartYearOption(undefined);
    setCycleLengthOption(undefined);
    setKeyControlDomain(undefined);
    setIsFCC(false);
    closeDialog();
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const result = await keyControlDomainService.getKeyControlDomains();
        setKeyControlDomains(formatArray(result?.data));
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleKeyControlDomainSelection = (option: Option) => {
    setKeyControlDomain(option);
  }

  const handleCycleLengthSelection = useCallback((option: Option) => {
    setCycleLengthOption(option);
    if (option.value !== CYCLE_LENGTH_FCC) {
      setIsFCC(false); setKeyControlDomain(undefined);
    }
  }, []);

  const handleIsFCC = useCallback(() => {
    setIsFCC((prev) => !prev);
    setKeyControlDomain(undefined);
  }, []);

  /** * handle cycle creation API call */
  const handleCreateCycle = async () => {
    setIsLoading(true);
    try {
      if (startYearOption || cycleLengthOption || !branchId || (isFCC && !keyControlDomain)) {
        console.error('Cycle creation impossible, missing parameters');
        return;
      }
      const result = await cyclesService.createCycle(startYearOption.value, cycleLengthOption.value, branchId, isFCC, keyControlDomain?.value);
      snackbarSuccess('Referentials.Cycle.addCycleDialog-success');
      handleCloseDialog();
      if (result?.data) {
        handleAddCycle(result.data);
      }
    } catch (e: any) {
      if (e.message = '400 POST api/cycles: Cycle already exists') {
        snackbarWarning('Referentials.cycle.addCycleDialog-alreadyExist');
      } else {
        snackbarWarning('Referentials.cycle.addCycleDialog-failure');
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog
      open={isDialogOpen}
      onClose={handleCloseDialog}
      maxWidth='sm'
      fullWidth
    >
      <DialogTitle title='Referentials.cycle.add' />
      <DialogContent dividers>
        <div>
          <Translate content='Referentials.cycle.addCycleDialog-startYear' />
          <Select
            menuPortalTarget={document.body}
            options={getStartYearOptions()}
            value={startYearOption}
            onChange={(option: Option) => setStartYearOption(option)}
            styles={{ menuPortal: (base: any) => ({ ...base, zIndex: 9999 }) }}
            placeholder={false}
          />
          <Translate content='Referentials.cycle.addCycleDialog.length' />
          <Select menuPortalTarget={document.body}
            options={cycleLengthOptions}
            value={cycleLengthOption}
            onChange={handleCycleLengthSelection}
            styles={{ menuPortal: (base: any) => ({ ...base, zIndex: 9999 }) }}
            placeholder={false}
          />
        </div>
        {branchId === BRANCHES.CPLE && (
          <div style={{ display: 'flex' }}>
            FCC:
            <Checkbox
              disabled={cycleLengthOption?.value !== CYCLE_LENGTH_FCC}
              checked={isFCC}
              onChange={handleIsFCC}
            />
          </div>
        )
        }
        {branchId === BRANCHES.CPLE && isFCC && (
          <>
            <Translate content='Referentials.cycle.addCycleDialog-keyControlDomain' />
            <DropDown
              dataTestId="keyControlDomain"
              options={keyControlDomains}
              value={keyControlDomain}
              onChange={handleKeyControlDomainSelection}
            />
          </>
        )}

        <DialogActions>
          <Button
            onClick={handleCloseDialog}
            color='secondary'
            variant="outlined"
          >
            <Translate content='common. cancel' />
            <ButtonWithLoader
              onClick={handleCreateCycle}
              loading={isLoading}
              text="common.save"
              autoFocus
              condition={isSaveButtonEnabled}
            />
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
}
