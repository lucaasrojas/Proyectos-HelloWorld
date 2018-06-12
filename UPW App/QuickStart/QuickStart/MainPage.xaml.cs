using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Runtime.InteropServices.WindowsRuntime;
using Windows.Foundation;
using Windows.Foundation.Collections;
using Windows.UI.Xaml;
using Windows.UI.Xaml.Controls;
using Windows.UI.Xaml.Controls.Primitives;
using Windows.UI.Xaml.Data;
using Windows.UI.Xaml.Input;
using Windows.UI.Xaml.Media;
using Windows.UI.Xaml.Navigation;
using Microsoft.Toolkit.Services.Bing;
using System.Collections.ObjectModel;

// The Blank Page item template is documented at https://go.microsoft.com/fwlink/?LinkId=402352&clcid=0x409

namespace QuickStart
{
    /// <summary>
    /// An empty page that can be used on its own or navigated to within a Frame.
    /// </summary>
    public sealed partial class MainPage : Page
    {
        public MainPage()
        {
            this.InitializeComponent();
            this.ViewModel = new Result();
            this.finalResult = new ObservableCollection<Result>();
            ;
        }
        
        public Result ViewModel { get; set; }
        public ObservableCollection<Result> finalResult = new ObservableCollection<Result>();

        public async void searchClick(object sender, RoutedEventArgs e)
        {
            //var input = searchInput.Text;
            //resultBox.Text = input;
            

            var searchConfig = new BingSearchConfig
            {
                Country = BingCountry.UnitedStates,
                Language = BingLanguage.English,
                Query = searchInput.Text,
                QueryType = BingQueryType.Search
            };

            var ItemsSource = await BingService.Instance.RequestAsync(searchConfig, 50);

            foreach (var item in ItemsSource)
            {
                finalResult.Add(new Result()
                {
                    Title = item.Title,
                    Summary = item.Summary,
                    Link = item.Link
                });
            }

            //System.Diagnostics.Debug.WriteLine(finalResult.Title);
        }
    }
}
