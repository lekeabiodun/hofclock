import { Button } from './ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog'
import { useTheme } from './ThemeProvider'
import { themeList } from '../lib/themes'

const OptionsDialog = ({ open, onOpenChange, options, onOptionsChange }) => {
    const { currentTheme, changeTheme } = useTheme()
    
    const toggleOption = (key) => {
        onOptionsChange({ ...options, [key]: !options[key] })
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Options</DialogTitle>
                    <DialogDescription>
                        Customize your clock settings
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 my-4">
                    {/* Theme Selector */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium">Color Theme</label>
                        <div className="grid grid-cols-2 gap-2">
                            {themeList.map((theme) => (
                                <Button
                                    key={theme.id}
                                    variant={currentTheme === theme.id ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => changeTheme(theme.id)}
                                    className="justify-start"
                                >
                                    <div 
                                        className="w-4 h-4 rounded-full mr-2" 
                                        style={{ background: theme.accentColor }}
                                    />
                                    {theme.name}
                                </Button>
                            ))}
                        </div>
                    </div>

                    {/* 24-Hour Format */}
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-medium">24-Hour Format</label>
                        <Button
                            variant={options.is24Hour ? "default" : "outline"}
                            size="sm"
                            onClick={() => toggleOption('is24Hour')}
                        >
                            {options.is24Hour ? 'On' : 'Off'}
                        </Button>
                    </div>

                    {/* Show Seconds */}
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-medium">Show Seconds</label>
                        <Button
                            variant={options.showSeconds ? "default" : "outline"}
                            size="sm"
                            onClick={() => toggleOption('showSeconds')}
                        >
                            {options.showSeconds ? 'On' : 'Off'}
                        </Button>
                    </div>

                    {/* Show Date */}
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-medium">Show Date</label>
                        <Button
                            variant={options.showDate ? "default" : "outline"}
                            size="sm"
                            onClick={() => toggleOption('showDate')}
                        >
                            {options.showDate ? 'On' : 'Off'}
                        </Button>
                    </div>

                    {/* Sound Alerts */}
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-medium">Sound Alerts</label>
                        <Button
                            variant={options.soundAlerts ? "default" : "outline"}
                            size="sm"
                            onClick={() => toggleOption('soundAlerts')}
                        >
                            {options.soundAlerts ? 'On' : 'Off'}
                        </Button>
                    </div>
                </div>
                <div className="flex justify-end">
                    <Button onClick={() => onOpenChange(false)}>
                        Close
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default OptionsDialog

